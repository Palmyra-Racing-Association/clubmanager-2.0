DELIMITER //
DROP VIEW IF EXISTS `v_job`;
CREATE VIEW `v_job` AS
    SELECT
		j.job_id,
		if(
			isnull(j.paid_labor),
            CONCAT(m.first_name, ' ', m.last_name), 
            j.paid_labor
		) AS member,
		m.member_id,
		m.membership_id,
		e.event_name as event,
		e.event_id,
		e.event_type_id,
		j.job_start_date as start,
		j.job_end_date as end,
		jt.job_type_id,
		jt.title as title,		
		j.verified,
		DATE_FORMAT(j.verified_date, '%Y-%m-%d') AS verified_date,
		j.points_awarded,
		j.cash_payout,
		jt.job_day_number,
		jt.meal_ticket,
		jt.sort_order,
		j.paid,
		DATE_FORMAT(j.paid_date, '%Y-%m-%d') AS paid_date,
		DATE_FORMAT(j.last_modified_date, '%Y-%m-%d') AS last_modified_date,
		CONCAT(m2.first_name, ' ', m2.last_name) AS last_modified_by
    FROM
        job j
            LEFT JOIN
        member m ON m.member_id = j.member_id
			LEFT JOIN
		member m2 ON m2.member_id = j.last_modified_by
            LEFT JOIN
        event e ON e.event_id = j.event_id
            LEFT JOIN
        job_type jt ON j.job_type_id = jt.job_type_id;
//