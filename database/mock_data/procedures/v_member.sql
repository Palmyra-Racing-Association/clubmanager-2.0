DELIMITER //
CREATE VIEW `v_member` AS
    SELECT 
        m.member_id,
        m.first_name,
        m.last_name,
        CONCAT(ma.first_name, ' ', ma.last_name) AS membership_admin,
        m.uuid,
        m.active,
        mt.type as member_type,
        m.phone_number,
        m.occupation,
        m.email,
        DATE_FORMAT(m.birthdate, '%Y-%m-%d') AS birthdate,
        DATE_FORMAT(m.date_joined, '%Y-%m-%d') AS date_joined,
        ms.address,
        ms.city,
        ms.state,
        ms.zip,
        DATE_FORMAT(m.last_modified_date, '%Y-%m-%d') AS last_modified_date,
        m.last_modified_by
    FROM
        member m
            LEFT JOIN
        membership ms ON m.membership_id = ms.membership_id
            LEFT JOIN
        member ma ON ms.membership_admin_id = ma.member_id
            LEFT JOIN
        member_types mt ON m.member_type_id = mt.member_type_id;
//