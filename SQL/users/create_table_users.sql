create table users
(
    user_id     int         NOT NULL AUTO_INCREMENT,
    username    char(50)    NOT NULL,
    email       char(255)   NOT NULL,
    salt        char(50)    NOT NULL,
    hash        char(255)   NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    PRIMARY KEY (user_id)
)ENGINE=InnoDB