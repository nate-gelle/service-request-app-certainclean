const pool = require('../../pool');

/*
This is the example provided by Mary for how to do these large queries.

`SELECT 
    task.*, 
	  CASE WHEN count(st) = 0 THEN ARRAY[]::json[] ELSE array_agg(st.subtask) END AS subtasks,
	  json_build_object('id', c.id, 'name', c.name) as category
  FROM task 
  JOIN category c ON task.category_id = c.id 
  LEFT OUTER JOIN (
      SELECT task_id, json_build_object('id', subtask.id, 'task_id', subtask.task_id, 'description', 	subtask.description, 'complete', subtask.complete) as subtask
      FROM subtask ORDER BY subtask.id
    ) st on st.task_id=task.id 
  GROUP BY task.id, c.id, c.name ORDER BY task.id;`
*/

/*
    Refactoring of above function and RequestTable class.

    This function should use 'json_build_object' and array_agg() to return an array of objects structured like:
[
    {
        request_info: {
            id: ?,
            start_time: ?,
            end_time: ?,
            est_duration: ?,
            status: ?
        },
        contact_info: {
            contact_id: ?,
            first_name: ?,
            last_name: ?,
            email: ?,
            phone_number: ?,
            address: ?
        }
        rooms: [?] -- This part is currently absent from the query below.  
    },
    etc.
]
*/
function getRequestData(sort){
    // See explanation in above multi-line comments
    if (sort.sort){
        console.log(`sort`, sort)
        return new Promise(async (resolve, reject)=>{
            try{
                const queryText = `
                SELECT
                request.id as sort_id, 
                json_build_object('request_id', request.id, 'start_time', request.start, 'end_time', request.end, 'est_duration', request.est_duration, 'status', request.status, 'location_type', request.location_type_id, 'cleaning_type', cleaning_type.cleaning_type) as request_info,
                    json_build_object('contact_id', contact.id, 'first_name', contact.first_name, 'last_name', contact.last_name, 'email', contact.email, 'phone_number', contact.phone_number, 'address', contact.location_address) as contact_info,
                    json_build_object('rooms', array_agg(json_build_object('room_id', room.id, 'room_name', room.room_name, 'location_type_id', room.location_type_id, 'cleanliness_score', request_room_junction.cleanliness_score))) as room_info
                from request_room_junction
                LEFT OUTER JOIN request on request.id = request_room_junction.request_id
                LEFT JOIN room on room.id = request_room_junction.room_id
                LEFT JOIN contact on contact.request_id = request_room_junction.request_id
                LEFT JOIN cleaning_type ON cleaning_type.id = request.cleaning_type_id
                GROUP BY request_room_junction.request_id, request.id, contact.id, cleaning_type
                ORDER BY ${sort.sort} ${sort.order};`;
                const result = await pool.query(queryText).then(result => { return result.rows});
                // console.log(`result.rows`, result)
                resolve(result);
            }catch(error){
                console.log('Error in getRequestData: ', error);
                reject();
            }
        
        });
    } else {
        return new Promise(async (resolve, reject)=>{
            try{
                const queryText = `
                SELECT
                json_build_object('request_id', request.id, 'start_time', request.start, 'end_time', request.end, 'est_duration', request.est_duration, 'status', request.status, 'location_type', request.location_type_id, 'cleaning_type', cleaning_type.cleaning_type) as request_info,
                    json_build_object('contact_id', contact.id, 'first_name', contact.first_name, 'last_name', contact.last_name, 'email', contact.email, 'phone_number', contact.phone_number, 'address', contact.location_address) as contact_info,
                    json_build_object('rooms', array_agg(json_build_object('room_id', room.id, 'room_name', room.room_name, 'location_type_id', room.location_type_id, 'cleanliness_score', request_room_junction.cleanliness_score))) as room_info
                from request_room_junction
                LEFT OUTER JOIN request on request.id = request_room_junction.request_id
                LEFT JOIN room on room.id = request_room_junction.room_id
                LEFT JOIN contact on contact.request_id = request_room_junction.request_id
                LEFT JOIN cleaning_type ON cleaning_type.id = request.cleaning_type_id
                GROUP BY request_room_junction.request_id, request.id, contact.id, cleaning_type;`;
                const result = await pool.query(queryText).then(result => { 
                    // console.log(`result.rows on getRequestData`, result.rows);
                    return result.rows});
                // console.log(`result.rows`, result)
                resolve(result);
            }catch(error){
                console.log('Error in getRequestData: ', error);
                reject();
            }
        
        });
    }
}

module.exports = getRequestData;