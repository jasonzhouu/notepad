create table notes
(
    note_id     int          NOT NULL AUTO_INCREMENT,
    content     MEDIUMTEXT   NOT NULL,
    public      boolean      NOT NULL default 0,
    user_id     int          NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
    PRIMARY KEY (note_id),
    FULLTEXT(content)
)ENGINE=MyISAM;