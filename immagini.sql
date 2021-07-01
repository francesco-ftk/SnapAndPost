/* Database immagini */

DROP TABLE IF EXISTS immagini CASCADE;

CREATE TABLE immagini (
  id int(11) NOT NULL auto_increment,
  latitudine double NOT NULL,
  longitudine double NOT NULL,
  immagine MEDIUMBLOB NOT NULL,
  nome VARCHAR(200) NOT NULL,
  PRIMARY KEY(id)
 )ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*
. ' `nome` varchar(50) NOT NULL default "",'
. ' `size` varchar(25) NOT NULL default "",'
. ' `type` varchar(25) NOT NULL default "",'
 */