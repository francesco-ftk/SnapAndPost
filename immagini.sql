/* Database immagini */

DROP TABLE IF EXISTS immagini CASCADE;

CREATE TABLE immagini (
  id int(11) NOT NULL auto_increment,
  latitudine float NOT NULL,
  longitudine float NOT NULL,
  immagine BLOB NOT NULL,
  PRIMARY KEY(id)
 )

/*
. ' `nome` varchar(50) NOT NULL default "",'
. ' `size` varchar(25) NOT NULL default "",'
. ' `type` varchar(25) NOT NULL default "",'
 */