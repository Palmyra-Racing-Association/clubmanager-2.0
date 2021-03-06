DELIMITER //
DROP PROCEDURE IF EXISTS `sp_patch_event_type`;
CREATE PROCEDURE `sp_patch_event_type`(
IN _event_type_id INT,
IN _type VARCHAR(50),
IN _active BIT,
IN _modified_by INT
)
BEGIN
SELECT type, active
    INTO @cur_type, @cur_active
    FROM event_type b
    WHERE event_type_id = _event_type_id;
    
    UPDATE event_type SET
		type = IFNULL(_type, @cur_type),
        active = IFNULL(_active, @cur_active),
        last_modified_by = _modified_by,
		last_modified_date = CURDATE()
	WHERE event_type_id = _event_type_id;
END//