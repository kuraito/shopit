-- Inserimento dati di esempio utente di prova
INSERT INTO users (username, password)
VALUES (
  'userProva1',
  '$2b$10$95zvQmdIYhM7nk.SCSCmZeR3WA/WwUF40lVUyTmzcvWx3SH8MBtji'
);


INSERT INTO product (id, name, description) VALUES
(1, 'Buono Pizza', 'Buono per pizza a scelta in pizzeria'),
(2, 'Buono Cinema', 'Biglietto cinema valido per un film'),
(3, 'Buono Caffè', 'Caffè + dolce in bar convenzionato');


INSERT INTO product_price (product_id, amount, descrizione) VALUES
(1, 10.00, 'Da Ciro - Via Vesuvio 10 (NA)'),
(1, 20.00, 'Da Gino - Via Mole 1 (TO)'),
(2, 4.20, 'Guida galattica per autostoppisti'),
(2, 12.00, 'Zoolander 2'),
(3, 3.00, 'Caffetteria da Cristina');


INSERT INTO asset (product_id, url) VALUES
(1, '/images/pizza1.jpg'),
(1, '/images/pizza2.jpg'),
(2, '/images/cinema1.jpg'),
(2, '/images/cinema2.jpg'),
(3, '/images/caffe1.jpg');
