CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    country_code VARCHAR(10),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255), -- If authentication is implemented
    full_name VARCHAR(255),
    age_group VARCHAR(20), -- e.g., "<18", "19-24"
    gender VARCHAR(10),    -- e.g., "Male", "Female", "Other"
    region_id INTEGER REFERENCES regions(region_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_region_id ON users(region_id);
CREATE INDEX idx_users_age_group ON users(age_group);
CREATE INDEX idx_users_gender ON users(gender);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_category_id INTEGER REFERENCES categories(category_id) NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skus (
    sku_id SERIAL PRIMARY KEY,
    sku_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(category_id),
    stock_status VARCHAR(20) DEFAULT 'Available',
    is_listed BOOLEAN DEFAULT TRUE,
    is_digitized BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(512),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skus_category_id ON skus(category_id);
CREATE INDEX idx_skus_name ON skus(name); -- For searching



CREATE TABLE website_visits (
    visit_timestamp TIMESTAMPTZ NOT NULL,
    visit_id BIGSERIAL,
    user_id INTEGER REFERENCES users(user_id) NULL,
    session_id TEXT,
    duration_seconds INTEGER,
    device_type TEXT,
    browser_type TEXT,
    traffic_source TEXT,

    referring_url TEXT,
    landing_page_url TEXT,
    exit_page_url TEXT,

    region_id INTEGER REFERENCES regions(region_id) NULL,
    ip_address TEXT,
    is_bounce BOOLEAN DEFAULT FALSE,
    conversion_event_occurred BOOLEAN DEFAULT FALSE,
    utm_params JSONB NULL,
    metadata JSONB NULL,

    CONSTRAINT visit_pk PRIMARY KEY (visit_timestamp, visit_id)
);

SELECT create_hypertable('website_visits', 'visit_timestamp', if_not_exists => TRUE);


CREATE INDEX idx_visits_user_id ON website_visits(user_id, visit_timestamp DESC);
CREATE INDEX idx_visits_session_id ON website_visits(session_id, visit_timestamp DESC);
CREATE INDEX idx_visits_region_id ON website_visits(region_id, visit_timestamp DESC);
CREATE INDEX idx_visits_traffic_source ON website_visits(traffic_source, visit_timestamp DESC);
CREATE INDEX idx_visits_device_type ON website_visits(device_type, visit_timestamp DESC);
CREATE INDEX idx_visits_browser_type ON website_visits(browser_type, visit_timestamp DESC);


CREATE TABLE sku_interactions (
    interaction_timestamp TIMESTAMPTZ NOT NULL,
    interaction_id BIGSERIAL,
    visit_id BIGINT,
    session_id TEXT,
    user_id INTEGER REFERENCES users(user_id) NULL,
    sku_id INTEGER NOT NULL REFERENCES skus(sku_id),
    interaction_type TEXT NOT NULL,
    duration_seconds INTEGER NULL,
    embed_assisted BOOLEAN DEFAULT FALSE,
    metadata JSONB NULL,

    PRIMARY KEY (interaction_timestamp, sku_id, interaction_id)
);

SELECT create_hypertable('sku_interactions', 'interaction_timestamp', 'sku_id', 4, if_not_exists => TRUE);


CREATE INDEX idx_interactions_sku_id ON sku_interactions(sku_id, interaction_timestamp DESC);
CREATE INDEX idx_interactions_user_id ON sku_interactions(user_id, interaction_timestamp DESC);
CREATE INDEX idx_interactions_session_id ON sku_interactions(session_id, interaction_timestamp DESC);
CREATE INDEX idx_interactions_type ON sku_interactions(interaction_type, interaction_timestamp DESC);
CREATE INDEX idx_interactions_embed ON sku_interactions(embed_assisted, interaction_timestamp DESC);

CREATE TABLE sales_funnel_events (
    event_timestamp TIMESTAMPTZ NOT NULL,
    funnel_event_id BIGSERIAL,
    visit_id BIGINT,
    session_id TEXT,
    sku_id INTEGER REFERENCES skus(sku_id) NULL,
    user_id INTEGER REFERENCES users(user_id) NULL,
    funnel_stage TEXT NOT NULL,
    metadata JSONB NULL,

    PRIMARY KEY (event_timestamp, funnel_stage, funnel_event_id)
);

SELECT create_hypertable('sales_funnel_events', 'event_timestamp', 'funnel_stage', 4, if_not_exists => TRUE);


CREATE INDEX idx_funnel_visit_id ON sales_funnel_events(visit_id, event_timestamp DESC);
CREATE INDEX idx_funnel_session_id ON sales_funnel_events(session_id, event_timestamp DESC);
CREATE INDEX idx_funnel_user_id ON sales_funnel_events(user_id, event_timestamp DESC);
CREATE INDEX idx_funnel_sku_id ON sales_funnel_events(sku_id, event_timestamp DESC);
CREATE INDEX idx_funnel_stage ON sales_funnel_events(funnel_stage, event_timestamp DESC);

CREATE TABLE orders (
    order_date TIMESTAMPTZ NOT NULL,
    order_id BIGSERIAL,
    user_id INTEGER REFERENCES users(user_id) NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL,  -- Changed from VARCHAR(20) to TEXT
    region_id INTEGER REFERENCES regions(region_id),
    shipping_address TEXT,
    billing_address TEXT,
    metadata JSONB NULL,

    PRIMARY KEY (order_date, order_id)
);

SELECT create_hypertable('orders', 'order_date', if_not_exists => TRUE);


CREATE INDEX idx_orders_user_id ON orders(user_id, order_date DESC);
CREATE INDEX idx_orders_status ON orders(status, order_date DESC);
CREATE INDEX idx_orders_region_id ON orders(region_id, order_date DESC);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_date TIMESTAMPTZ NOT NULL,
    order_id BIGINT NOT NULL,
    sku_id INTEGER NOT NULL REFERENCES skus(sku_id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_order FOREIGN KEY (order_date, order_id)
      REFERENCES orders (order_date, order_id) ON DELETE CASCADE
);
CREATE TABLE
tsdb=> CREATE INDEX idx_orderitems_order_id ON order_items(order_id);
CREATE INDEX idx_orderitems_sku_id ON order_items(sku_id);



ALTER TABLE website_visits SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'region_id, traffic_source, device_type, browser_type',
    timescaledb.compress_orderby = 'visit_timestamp DESC'
);
SELECT add_compression_policy('website_visits', INTERVAL '7 days');

ALTER TABLE sku_interactions SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'sku_id, interaction_type, user_id',
    timescaledb.compress_orderby = 'interaction_timestamp DESC'
);
SELECT add_compression_policy('sku_interactions', INTERVAL '7 days');

ALTER TABLE sales_funnel_events SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'funnel_stage, sku_id, user_id',
    timescaledb.compress_orderby = 'event_timestamp DESC'
);
SELECT add_compression_policy('sales_funnel_events', INTERVAL '7 days');

ALTER TABLE website_visits SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'region_id, traffic_source, device_type, browser_type, visit_id',
    timescaledb.compress_orderby = 'visit_timestamp DESC'
);


ALTER TABLE sku_interactions SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'sku_id, interaction_type, user_id, interaction_id',
    timescaledb.compress_orderby = 'interaction_timestamp DESC'
);

ALTER TABLE sales_funnel_events SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'funnel_stage, sku_id, user_id, funnel_event_id',
    timescaledb.compress_orderby = 'event_timestamp DESC'
);
CREATE MATERIALIZED VIEW daily_visits_summary
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', visit_timestamp) AS bucket,
    region_id,
    traffic_source,
    device_type,
    COUNT(*) AS total_visits,
    COUNT(DISTINCT session_id) AS unique_sessions, -- Approximation for unique visitors daily
    SUM(CASE WHEN is_bounce THEN 1 ELSE 0 END) AS total_bounces,
    AVG(duration_seconds) AS avg_duration
FROM website_visits
GROUP BY bucket, region_id, traffic_source, device_type;


SELECT add_continuous_aggregate_policy('daily_visits_summary',
    start_offset => INTERVAL '3 days', -- Start aggregating data older than 3 days
    end_offset   => INTERVAL '1 hour',  -- Aggregate up to 1 hour ago
    schedule_interval => INTERVAL '1 hour');


CREATE MATERIALIZED VIEW daily_sku_interaction_summary
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', interaction_timestamp) AS bucket,
    sku_id,
    interaction_type,
    embed_assisted,
    COUNT(*) AS interaction_count,
    AVG(duration_seconds) FILTER (WHERE interaction_type = '3DView') AS avg_3d_view_duration -- Example specific metric
FROM sku_interactions
GROUP BY bucket, sku_id, interaction_type, embed_assisted;

SELECT add_continuous_aggregate_policy('daily_sku_interaction_summary',
    start_offset => INTERVAL '3 days',
    end_offset   => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

CREATE MATERIALIZED VIEW daily_sales_summary
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', o.order_date) as bucket,
    oi.sku_id,
    o.region_id,
    SUM(oi.quantity) as total_units_sold,
    SUM(oi.quantity * oi.price_at_purchase) as total_revenue,
    COUNT(DISTINCT o.order_id) as total_orders
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.status = 'Completed' -- Only count completed orders for revenue
GROUP BY bucket, oi.sku_id, o.region_id;

SELECT add_continuous_aggregate_policy('daily_sales_summary',
    start_offset => INTERVAL '7 days',
    end_offset   => INTERVAL '1 day', -- Less frequent refresh might be okay for sales
    schedule_interval => INTERVAL '1 day');

