DROP TYPE IF EXISTS categ_culori_nft;
DROP TYPE IF EXISTS Colectie;

CREATE TYPE categ_culori_nft AS ENUM( 'toate','rosu', 'albastru', 'mov', 'auriu', 'portocaliu','roz','verde','maro');
CREATE TYPE Colectie AS ENUM('toate','Azuki', 'Beanz');


CREATE TABLE IF NOT EXISTS nft_produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   imagine VARCHAR(300),
   views INT NOT NULL CHECK (views>=0),  
   --calorii INT NOT NULL CHECK (calorii>=0), 
   categ categ_culori_nft DEFAULT 'toate',
   Colectii Colectie DEFAULT 'toate',
   elemente_nft VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   Disponibilitate BOOLEAN NOT NULL DEFAULT FALSE,
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into nft_produse (nume,descriere,pret, views, Colectii ,categ, elemente_nft, Disponibilitate, imagine) VALUES 
('Azuki-427', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 14 , 100, 'Azuki', 'portocaliu', '{"tricou","steag","par scurt"}', True, 'azuki-427.png'),

('Azuki-1689', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 6 , 200, 'Azuki', 'verde', '{"camasa","ponytail"}', True, 'azuki-1689.png'),

('Azuki-2002', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 35 , 1000, 'Azuki', 'verde', '{"halat","par_scurt"}', True,'azuki-2002.png'),

('Azuki-3492', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 10 , 250, 'Azuki', 'albastru', '{"hanorac","bandana","esarfa","par lung"}', True,'azuki-3492.png'),

('Azuki-5942', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 6 , 245, 'Azuki', 'mov', '{"tricou","tatuaj","par scurt"}', False,'azuki-5942.png'),

('Azuki-6023', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 10 , 100, 'Azuki', 'maro', '{"hanorac","steag","par lung","bandana"}', True, 'azuki-6023.png'),

('Azuki-6515', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 25.5 , 1000, 'Azuki', 'mov', '{"umbrela","jacheta","coc","par lung"}', True, 'auzki-6515.png'),

('Azuki-9899', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 8 , 145, 'Azuki', 'verde', '{"par scurt","undita","jacheta"}', True, 'azuki-9899.png'),

('Beanz-1592', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 12 , 400, 'Beanz', 'rosu', '{"sapca","halat","skateboard"}', True ,'final-1592.png'),

('Beanz-1601', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 10 , 400, 'Beanz', 'portocaliu', '{"pulover"}', False, 'final-1601.png'),

('Beanz-2993', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 70 , 450, 'Beanz', 'albastru', '{"cagula","jacheta"}', True, 'final-2993.png'),

('Beanz-3058', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 5 , 150, 'Beanz', 'rosu', '{"masca","sapca","creion"}', True, 'final-3058.png'),

('Beanz-3335', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 15 , 180, 'Beanz', 'maro', '{"topor","foc"}', True, 'final-3335.png'),

('Beanz-3802', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 20.5 , 350, 'Beanz', 'rosu', '{"hanorac","electricitate"}', True, 'final-3802.png'),

('Beanz-8043', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 6 , 100, 'Beanz', 'mov', '{"jacheta","ochelari","palarie","bata"}', True, 'final-8043.png'),

('Beanz-19828', 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.', 18.5 , 225, 'Beanz', 'portocaliu', '{"halat","petic"}', True, 'final-19828.png');

select
*
from nft_produse