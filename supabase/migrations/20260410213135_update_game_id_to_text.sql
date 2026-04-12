TRUNCATE TABLE card, player, game CASCADE;

ALTER TABLE card DROP CONSTRAINT card_game_id_fkey;
ALTER TABLE player DROP CONSTRAINT player_game_id_fkey;

ALTER TABLE game ALTER COLUMN id TYPE text;
ALTER TABLE card ALTER COLUMN game_id TYPE text;
ALTER TABLE player ALTER COLUMN game_id TYPE text;

ALTER TABLE card
ADD CONSTRAINT card_game_id_fkey
FOREIGN KEY (game_id) REFERENCES game(id);

ALTER TABLE player
ADD CONSTRAINT player_game_id_fkey
FOREIGN KEY (game_id) REFERENCES game(id);