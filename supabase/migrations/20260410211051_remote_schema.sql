


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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."cardtype" AS ENUM (
    'red',
    'blue',
    'assassin',
    'neutral'
);


ALTER TYPE "public"."cardtype" OWNER TO "postgres";


CREATE TYPE "public"."role" AS ENUM (
    'spymaster_red',
    'spymaster_blue',
    'operative_red',
    'operative_blue'
);


ALTER TYPE "public"."role" OWNER TO "postgres";


CREATE TYPE "public"."teamtype" AS ENUM (
    'red',
    'blue'
);


ALTER TYPE "public"."teamtype" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."card" (
    "id" integer NOT NULL,
    "game_id" integer NOT NULL,
    "word" character varying(255) NOT NULL,
    "card_type" "public"."cardtype" NOT NULL,
    "guessed" boolean NOT NULL
);


ALTER TABLE "public"."card" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."card_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."card_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."card_id_seq" OWNED BY "public"."card"."id";



CREATE TABLE IF NOT EXISTS "public"."game" (
    "id" integer NOT NULL,
    "winner" "public"."teamtype",
    "turn" "public"."teamtype"
);


ALTER TABLE "public"."game" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."game_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."game_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."game_id_seq" OWNED BY "public"."game"."id";



CREATE TABLE IF NOT EXISTS "public"."player" (
    "id" integer NOT NULL,
    "game_id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "team" "public"."teamtype" NOT NULL,
    "role" "public"."role" NOT NULL,
    "host" boolean NOT NULL
);


ALTER TABLE "public"."player" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."player_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."player_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."player_id_seq" OWNED BY "public"."player"."id";



ALTER TABLE ONLY "public"."card" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."card_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."game" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."game_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."player" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."player_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."card"
    ADD CONSTRAINT "card_game_id_word_key" UNIQUE ("game_id", "word");



ALTER TABLE ONLY "public"."card"
    ADD CONSTRAINT "card_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."game"
    ADD CONSTRAINT "game_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."player"
    ADD CONSTRAINT "player_game_id_name_key" UNIQUE ("game_id", "name");



ALTER TABLE ONLY "public"."player"
    ADD CONSTRAINT "player_pkey" PRIMARY KEY ("id");



CREATE INDEX "ix_card_card_type" ON "public"."card" USING "btree" ("card_type");



CREATE INDEX "ix_card_game_id" ON "public"."card" USING "btree" ("game_id");



CREATE INDEX "ix_card_word" ON "public"."card" USING "btree" ("word");



CREATE INDEX "ix_game_winner" ON "public"."game" USING "btree" ("winner");



CREATE INDEX "ix_player_game_id" ON "public"."player" USING "btree" ("game_id");



CREATE INDEX "ix_player_role" ON "public"."player" USING "btree" ("role");



CREATE INDEX "ix_player_team" ON "public"."player" USING "btree" ("team");



ALTER TABLE ONLY "public"."card"
    ADD CONSTRAINT "card_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id");



ALTER TABLE ONLY "public"."player"
    ADD CONSTRAINT "player_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."card" TO "anon";
GRANT ALL ON TABLE "public"."card" TO "authenticated";
GRANT ALL ON TABLE "public"."card" TO "service_role";



GRANT ALL ON SEQUENCE "public"."card_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."card_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."card_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."game" TO "anon";
GRANT ALL ON TABLE "public"."game" TO "authenticated";
GRANT ALL ON TABLE "public"."game" TO "service_role";



GRANT ALL ON SEQUENCE "public"."game_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."game_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."game_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."player" TO "anon";
GRANT ALL ON TABLE "public"."player" TO "authenticated";
GRANT ALL ON TABLE "public"."player" TO "service_role";



GRANT ALL ON SEQUENCE "public"."player_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."player_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."player_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


