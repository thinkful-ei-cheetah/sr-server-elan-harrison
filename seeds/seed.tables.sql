BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Italian', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'pratica', 'practice', 2),
  (2, 1, 'ciao', 'hello', 3),
  (3, 1, 'casa', 'house', 4),
  (4, 1, 'sviluppatore', 'developer', 5),
  (5, 1, 'tradurre', 'translate', 6),
  (6, 1, 'stupefacente', 'amazing', 7),
  (7, 1, 'cane', 'dog', 8),
  (8, 1, 'gatto', 'cat', 9);
  (9, 1, 'tomato', 'pomodoro', 10);
  (10, 1, 'strawberry', 'fragola', null);


UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
