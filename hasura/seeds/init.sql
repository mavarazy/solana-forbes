--
-- PostgreSQL database dump
--

-- Dumped from database version 13.8 (Debian 13.8-1.pgdg90+1)
-- Dumped by pg_dump version 13.8 (Debian 13.8-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY "public"."nft_collection_social" DROP CONSTRAINT IF EXISTS "nft_collection_social_web_fkey";
ALTER TABLE IF EXISTS ONLY "public"."nft_collection_price" DROP CONSTRAINT IF EXISTS "nft_collection_price_source_fkey";
ALTER TABLE IF EXISTS ONLY "public"."nft_collection_price_change" DROP CONSTRAINT IF EXISTS "nft_collection_price_change_marketplace_fkey";
ALTER TABLE IF EXISTS ONLY "public"."nft_collection_price_change" DROP CONSTRAINT IF EXISTS "nft_collection_price_change_collection_fkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_scheduled_event_invocation_logs" DROP CONSTRAINT IF EXISTS "hdb_scheduled_event_invocation_logs_event_id_fkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_cron_event_invocation_logs" DROP CONSTRAINT IF EXISTS "hdb_cron_event_invocation_logs_event_id_fkey";
DROP TRIGGER IF EXISTS "set_public_wallets_updated_at" ON "public"."wallet";
DROP TRIGGER IF EXISTS "set_public_nft_collection_price_updated_at" ON "public"."nft_collection_price";
DROP INDEX IF EXISTS "hdb_catalog"."hdb_version_one_row";
DROP INDEX IF EXISTS "hdb_catalog"."hdb_scheduled_event_status";
DROP INDEX IF EXISTS "hdb_catalog"."hdb_cron_events_unique_scheduled";
DROP INDEX IF EXISTS "hdb_catalog"."hdb_cron_event_status";
DROP INDEX IF EXISTS "hdb_catalog"."hdb_cron_event_invocation_event_id";
ALTER TABLE IF EXISTS ONLY "public"."wallet" DROP CONSTRAINT IF EXISTS "wallets_pkey";
ALTER TABLE IF EXISTS ONLY "public"."token_worth_summary" DROP CONSTRAINT IF EXISTS "token_worth_summary_pkey";
ALTER TABLE IF EXISTS ONLY "public"."nft_marketplace" DROP CONSTRAINT IF EXISTS "nft_marketplace_pkey";
ALTER TABLE IF EXISTS ONLY "public"."nft_collection_social" DROP CONSTRAINT IF EXISTS "nft_collection_social_pkey";
ALTER TABLE IF EXISTS ONLY "public"."nft_collection_price" DROP CONSTRAINT IF EXISTS "nft_collection_price_pkey";
ALTER TABLE IF EXISTS ONLY "public"."nft_collection_price_change" DROP CONSTRAINT IF EXISTS "nft_collection_price_change_pkey";
ALTER TABLE IF EXISTS ONLY "public"."nft_collection" DROP CONSTRAINT IF EXISTS "nft_collection_pkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_version" DROP CONSTRAINT IF EXISTS "hdb_version_pkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_schema_notifications" DROP CONSTRAINT IF EXISTS "hdb_schema_notifications_pkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_scheduled_events" DROP CONSTRAINT IF EXISTS "hdb_scheduled_events_pkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_scheduled_event_invocation_logs" DROP CONSTRAINT IF EXISTS "hdb_scheduled_event_invocation_logs_pkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_metadata" DROP CONSTRAINT IF EXISTS "hdb_metadata_resource_version_key";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_metadata" DROP CONSTRAINT IF EXISTS "hdb_metadata_pkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_cron_events" DROP CONSTRAINT IF EXISTS "hdb_cron_events_pkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_cron_event_invocation_logs" DROP CONSTRAINT IF EXISTS "hdb_cron_event_invocation_logs_pkey";
ALTER TABLE IF EXISTS ONLY "hdb_catalog"."hdb_action_log" DROP CONSTRAINT IF EXISTS "hdb_action_log_pkey";
DROP TABLE IF EXISTS "public"."wallet";
DROP TABLE IF EXISTS "public"."token_worth_summary";
DROP TABLE IF EXISTS "public"."nft_marketplace";
DROP TABLE IF EXISTS "public"."nft_collection_social";
DROP VIEW IF EXISTS "public"."nft_collection_price_stats";
DROP TABLE IF EXISTS "public"."nft_collection_price_change";
DROP TABLE IF EXISTS "public"."nft_collection_price";
DROP TABLE IF EXISTS "public"."nft_collection";
DROP TABLE IF EXISTS "hdb_catalog"."hdb_version";
DROP TABLE IF EXISTS "hdb_catalog"."hdb_schema_notifications";
DROP TABLE IF EXISTS "hdb_catalog"."hdb_scheduled_events";
DROP TABLE IF EXISTS "hdb_catalog"."hdb_scheduled_event_invocation_logs";
DROP TABLE IF EXISTS "hdb_catalog"."hdb_metadata";
DROP TABLE IF EXISTS "hdb_catalog"."hdb_cron_events";
DROP TABLE IF EXISTS "hdb_catalog"."hdb_cron_event_invocation_logs";
DROP TABLE IF EXISTS "hdb_catalog"."hdb_action_log";
DROP FUNCTION IF EXISTS "public"."set_current_timestamp_updated_at"();
DROP FUNCTION IF EXISTS "hdb_catalog"."gen_hasura_uuid"();
DROP EXTENSION IF EXISTS "pgcrypto";
DROP SCHEMA IF EXISTS "hdb_catalog";
--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "hdb_catalog";


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "public";


--
-- Name: EXTENSION "pgcrypto"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pgcrypto" IS 'cryptographic functions';


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: -
--

CREATE FUNCTION "hdb_catalog"."gen_hasura_uuid"() RETURNS "uuid"
    LANGUAGE "sql"
    AS $$select gen_random_uuid()$$;


--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."set_current_timestamp_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE "hdb_catalog"."hdb_action_log" (
    "id" "uuid" DEFAULT "hdb_catalog"."gen_hasura_uuid"() NOT NULL,
    "action_name" "text",
    "input_payload" "jsonb" NOT NULL,
    "request_headers" "jsonb" NOT NULL,
    "session_variables" "jsonb" NOT NULL,
    "response_payload" "jsonb",
    "errors" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "response_received_at" timestamp with time zone,
    "status" "text" NOT NULL,
    CONSTRAINT "hdb_action_log_status_check" CHECK (("status" = ANY (ARRAY['created'::"text", 'processing'::"text", 'completed'::"text", 'error'::"text"])))
);


--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE "hdb_catalog"."hdb_cron_event_invocation_logs" (
    "id" "text" DEFAULT "hdb_catalog"."gen_hasura_uuid"() NOT NULL,
    "event_id" "text",
    "status" integer,
    "request" "json",
    "response" "json",
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE "hdb_catalog"."hdb_cron_events" (
    "id" "text" DEFAULT "hdb_catalog"."gen_hasura_uuid"() NOT NULL,
    "trigger_name" "text" NOT NULL,
    "scheduled_time" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'scheduled'::"text" NOT NULL,
    "tries" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "next_retry_at" timestamp with time zone,
    CONSTRAINT "valid_status" CHECK (("status" = ANY (ARRAY['scheduled'::"text", 'locked'::"text", 'delivered'::"text", 'error'::"text", 'dead'::"text"])))
);


--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE "hdb_catalog"."hdb_metadata" (
    "id" integer NOT NULL,
    "metadata" "json" NOT NULL,
    "resource_version" integer DEFAULT 1 NOT NULL
);


--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE "hdb_catalog"."hdb_scheduled_event_invocation_logs" (
    "id" "text" DEFAULT "hdb_catalog"."gen_hasura_uuid"() NOT NULL,
    "event_id" "text",
    "status" integer,
    "request" "json",
    "response" "json",
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE "hdb_catalog"."hdb_scheduled_events" (
    "id" "text" DEFAULT "hdb_catalog"."gen_hasura_uuid"() NOT NULL,
    "webhook_conf" "json" NOT NULL,
    "scheduled_time" timestamp with time zone NOT NULL,
    "retry_conf" "json",
    "payload" "json",
    "header_conf" "json",
    "status" "text" DEFAULT 'scheduled'::"text" NOT NULL,
    "tries" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "next_retry_at" timestamp with time zone,
    "comment" "text",
    CONSTRAINT "valid_status" CHECK (("status" = ANY (ARRAY['scheduled'::"text", 'locked'::"text", 'delivered'::"text", 'error'::"text", 'dead'::"text"])))
);


--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE "hdb_catalog"."hdb_schema_notifications" (
    "id" integer NOT NULL,
    "notification" "json" NOT NULL,
    "resource_version" integer DEFAULT 1 NOT NULL,
    "instance_id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "hdb_schema_notifications_id_check" CHECK (("id" = 1))
);


--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE "hdb_catalog"."hdb_version" (
    "hasura_uuid" "uuid" DEFAULT "hdb_catalog"."gen_hasura_uuid"() NOT NULL,
    "version" "text" NOT NULL,
    "upgraded_on" timestamp with time zone NOT NULL,
    "cli_state" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "console_state" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL
);


--
-- Name: nft_collection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."nft_collection" (
    "name" "text" NOT NULL,
    "web" "text" NOT NULL,
    "thumbnail" "text" NOT NULL,
    "description" "text" NOT NULL,
    "parent" "text" NOT NULL,
    "supply" integer NOT NULL,
    "symbol" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: nft_collection_price; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."nft_collection_price" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "marketplace_url" "text",
    "price" numeric NOT NULL,
    "marketplace" "text" NOT NULL,
    "symbol" "text",
    "thumbnail" "text",
    "parent" "text",
    "volume" numeric DEFAULT '0'::numeric,
    "supply" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "website" "text"
);


--
-- Name: nft_collection_price_change; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."nft_collection_price_change" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "marketplace" "text" NOT NULL,
    "price" numeric NOT NULL,
    "volume" numeric NOT NULL,
    "date" "date" NOT NULL,
    "collection" "text" NOT NULL
);


--
-- Name: nft_collection_price_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW "public"."nft_collection_price_stats" AS
 SELECT "count"(*) AS "count",
    "nft_collection_price"."marketplace"
   FROM "public"."nft_collection_price"
  GROUP BY "nft_collection_price"."marketplace";


--
-- Name: nft_collection_social; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."nft_collection_social" (
    "web" "text" NOT NULL,
    "twitter" "text" NOT NULL,
    "discord" "text" NOT NULL,
    "instagram" "text" NOT NULL,
    "telegram" "text" NOT NULL
);


--
-- Name: nft_marketplace; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."nft_marketplace" (
    "value" "text" NOT NULL
);


--
-- Name: token_worth_summary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."token_worth_summary" (
    "mint" "text" NOT NULL,
    "amount" numeric NOT NULL,
    "decimals" numeric NOT NULL,
    "worth" numeric NOT NULL,
    "info" "jsonb",
    "percent" numeric NOT NULL,
    "usd" numeric NOT NULL,
    "symbol" "text" NOT NULL,
    "source" "text" NOT NULL,
    "count" integer NOT NULL
);


--
-- Name: wallet; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."wallet" (
    "id" "text" NOT NULL,
    "worth" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "sol" numeric NOT NULL,
    "tokens" "jsonb" NOT NULL,
    "summary" "jsonb" NOT NULL,
    "program" boolean NOT NULL,
    "priced" "jsonb",
    "general" "jsonb",
    "dev" "jsonb",
    "nfts" "jsonb",
    "change" numeric DEFAULT '0'::numeric NOT NULL
);


--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: -
--

COPY "hdb_catalog"."hdb_action_log" ("id", "action_name", "input_payload", "request_headers", "session_variables", "response_payload", "errors", "created_at", "response_received_at", "status") FROM stdin;
\.


--
-- Data for Name: hdb_cron_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: -
--

COPY "hdb_catalog"."hdb_cron_event_invocation_logs" ("id", "event_id", "status", "request", "response", "created_at") FROM stdin;
\.


--
-- Data for Name: hdb_cron_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: -
--

COPY "hdb_catalog"."hdb_cron_events" ("id", "trigger_name", "scheduled_time", "status", "tries", "created_at", "next_retry_at") FROM stdin;
\.


--
-- Data for Name: hdb_metadata; Type: TABLE DATA; Schema: hdb_catalog; Owner: -
--

COPY "hdb_catalog"."hdb_metadata" ("id", "metadata", "resource_version") FROM stdin;
1	{"sources":[{"configuration":{"connection_info":{"database_url":{"from_env":"HASURA_GRAPHQL_DATABASE_URL"},"isolation_level":"read-committed","pool_settings":{"connection_lifetime":600,"idle_timeout":180,"max_connections":50,"retries":1},"use_prepared_statements":true}},"kind":"postgres","name":"default","tables":[{"object_relationships":[{"name":"social","using":{"foreign_key_constraint_on":{"column":"web","table":{"name":"nft_collection_social","schema":"public"}}}}],"table":{"name":"nft_collection","schema":"public"}},{"configuration":{"column_config":{"marketplace_url":{"custom_name":"marketplaceUrl"}},"custom_column_names":{"marketplace_url":"marketplaceUrl"},"custom_root_fields":{}},"object_relationships":[{"name":"nft_marketplace","using":{"foreign_key_constraint_on":"marketplace"}}],"table":{"name":"nft_collection_price","schema":"public"}},{"table":{"name":"nft_collection_price_change","schema":"public"}},{"table":{"name":"nft_collection_price_stats","schema":"public"}},{"table":{"name":"nft_collection_social","schema":"public"}},{"array_relationships":[{"name":"nft_collection_prices","using":{"foreign_key_constraint_on":{"column":"marketplace","table":{"name":"nft_collection_price","schema":"public"}}}}],"is_enum":true,"table":{"name":"nft_marketplace","schema":"public"}},{"table":{"name":"token_worth_summary","schema":"public"}},{"table":{"name":"wallet","schema":"public"}}]}],"version":3}	42
\.


--
-- Data for Name: hdb_scheduled_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: -
--

COPY "hdb_catalog"."hdb_scheduled_event_invocation_logs" ("id", "event_id", "status", "request", "response", "created_at") FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: -
--

COPY "hdb_catalog"."hdb_scheduled_events" ("id", "webhook_conf", "scheduled_time", "retry_conf", "payload", "header_conf", "status", "tries", "created_at", "next_retry_at", "comment") FROM stdin;
\.


--
-- Data for Name: hdb_schema_notifications; Type: TABLE DATA; Schema: hdb_catalog; Owner: -
--

COPY "hdb_catalog"."hdb_schema_notifications" ("id", "notification", "resource_version", "instance_id", "updated_at") FROM stdin;
1	{"metadata":false,"remote_schemas":[],"sources":[]}	42	0f2998c0-4fb2-44e5-bc3d-6c85e191f43a	2022-06-27 03:56:02.86556+00
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: -
--

COPY "hdb_catalog"."hdb_version" ("hasura_uuid", "version", "upgraded_on", "cli_state", "console_state") FROM stdin;
f3c4b877-0726-4dc8-8c51-a44fe69ec55c	47	2022-06-27 03:53:17.211531+00	{}	{"console_notifications": {"admin": {"date": "2022-08-10T17:20:32.691Z", "read": "default", "showBadge": false}}, "telemetryNotificationShown": true, "disablePreReleaseUpdateNotifications": true}
\.


--
-- Data for Name: nft_collection; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."nft_collection" ("name", "web", "thumbnail", "description", "parent", "supply", "symbol", "created_at") FROM stdin;
\.

