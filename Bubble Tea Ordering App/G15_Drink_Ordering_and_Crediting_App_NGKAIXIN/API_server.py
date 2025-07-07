import sqlite3
from flask import Flask, jsonify, request, abort, render_template
from flask_socketio import SocketIO, emit
from argparse import ArgumentParser
from datetime import datetime
import json


DB = 'db.sqlite'

app = Flask(__name__)


app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)


@app.route('/chat')
def sessions():
    return render_template('index.html')


@socketio.on('my event2', namespace='/chat')
def handle_my_custom_event(json_data):
    print('received my event2: ' + str(json_data))


@socketio.on('connect', namespace='/chat')
def handle_connect_chat():
    print('connected')


@socketio.on('mobile_client_connected', namespace='/chat')
def handle_client_connected_chat(json):
    print("mobile_client_connected, status:" + str(json['connected']))
    return 'noticed'


@socketio.on('web_client_connected', namespace='/chat')
def handle_client_connected_chat(json):
    print("web_client_connected, status:" + str(json['connected']))


@socketio.on('message_sent', namespace='/chat')
def handle_client_send_chat(json_data, methods=['GET', 'POST']):
    print(json_data['message'])
    user_name = json_data['sender']
    message = json_data['message']
    data = {
        'timestamp': str(datetime.now()),
        'sender': user_name,
        'message': message,
    }
    emit('message_broadcast', json.dumps(data), broadcast=True)

# for users table
def get_row_as_dict(row):
    row_dict = {
        'id': row[0],
        'username': row[1],
        'email': row[2],
        'phone': row[3],
        'password': row[4],
    }

    return row_dict

# for orders table
def get_order_row_as_dict(row):
    return {
        'order_id': row[0],
        'user_id': row[1],
        'phone': row[2],
        'order_type': row[3],
        'total_price': row[4],
        'order_time': row[5],
        'address': row[6],
    }

# for order_items table
def get_order_item_row_as_dict(row):
    return {
        'item_id': row[0],
        'order_id': row[1],
        'drink_id': row[2],
        'name': row[3],
        'size': row[4],
        'quantity': row[5],
        'drink_price': row[6],
        'toppings': row[7],
        'ice_level': row[8],
        'sugar_level': row[9],
    }

# get all users
@app.route('/api/users', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users ORDER BY username')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

# get users by id
@app.route('/api/users/<int:user>', methods=['GET'])
def show(user):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE id=?', (str(user),))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = get_row_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


# craete user
@app.route('/api/users', methods=['POST'])
def store():
    if not request.json:
        abort(400, description="Request body must be JSON")
    # Ensure that all required fields are present
    required_fields = ['username', 'email', 'phone', 'password']
    for field in required_fields:
        if field not in request.json:
            abort(400, description=f'Missing required field: {field}')
    # Extract user data from the request
    new_user = (
        request.json['username'],
        request.json['email'],
        request.json['phone'],
        request.json['password']
    )
    # Connect to the SQLite database
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    try:
        # Insert the new user into the database
        cursor.execute('''
            INSERT INTO users(username, email, phone, password)
            VALUES (?, ?, ?, ?)
        ''', new_user)

        # Get the id of the newly created user
        user_id = cursor.lastrowid
        db.commit()
        # Prepare the response data
        response = {
            'id': user_id,
            'affected': db.total_changes,
        }
    except sqlite3.Error as e:
        db.rollback()  #
        app.logger.error(f"SQLite Error: {str(e)}")  
        return jsonify({"error": "Database error", "message": str(e)}), 500

    finally:
        db.close()

    return jsonify(response), 201


# get all orders
@app.route('/api/orders', methods=['GET'])
def get_all_orders():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orders ORDER BY order_id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    orders = []
    for row in rows: 
        row_as_dict = get_order_row_as_dict(row)
        orders.append(row_as_dict)

    return jsonify(orders), 200

# get order and order_items by order_id
@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orders WHERE order_id=?', (str(order_id),))
    order_row = cursor.fetchone()

    if order_row:
        cursor.execute('SELECT * FROM order_items WHERE order_id=?', (str(order_id),))
        item_rows = cursor.fetchall()
        db.close()

        order = get_order_row_as_dict(order_row)
        items = []
        for row in item_rows:
            row_as_dict = get_order_item_row_as_dict(row)
            items.append(row_as_dict)
        order['items'] = items
        #  adds the list of item into the order
        return jsonify(order), 200
    else:
        db.close()
        return jsonify({'message': 'No orders found'}), 200


# get order_item by order_id and drink_id
@app.route('/api/order_items/order/<int:order_id>/drink/<int:drink_id>', methods=['GET'])
def get_order_item(order_id, drink_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM order_items WHERE order_id=? AND drink_id=?', (str(order_id), str(drink_id)))
    item_row = cursor.fetchone()
    db.close()

    if item_row:
        item = get_order_item_row_as_dict(item_row)
        return jsonify(item), 200
    else:
        return jsonify({'message': 'Order item not found'}), 404


# get the orders by user_id
@app.route('/api/orders/user/<int:user_id>', methods=['GET'])
def get_orders_by_userId(user_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orders WHERE user_id=?', (user_id,))
    orders_rows = cursor.fetchall()

    if orders_rows:
        result = []
        for order_row in orders_rows:
            order = get_order_row_as_dict(order_row)
            cursor.execute('SELECT * FROM order_items WHERE order_id=?', (str(order['order_id']),))
            item_rows = cursor.fetchall()
            items = []
            for row in item_rows:
                item_as_dict = get_order_item_row_as_dict(row)
                items.append(item_as_dict)
            order['items'] = items
            result.append(order)
        db.close()
        return jsonify(result), 200
    else:
        db.close()
        return jsonify({'message': 'No orders found'}), 200


# create order and order_items
@app.route('/api/orders', methods=['POST'])
def create_order():
    if not request.json or 'user_id' not in request.json:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    # Check if there is an existing order for the user
    cursor.execute('''SELECT order_id FROM orders WHERE user_id = ? AND order_time IS NULL''', (request.json['user_id'],))
    existing_order = cursor.fetchone()

    if existing_order:
        # If an existing order is found, use that order_id
        order_id = existing_order[0]
    else:
        # If no existing order, create a new order
        cursor.execute('''
            INSERT INTO orders(user_id, phone, order_type, total_price, order_time, address)
            VALUES (?, NULL, NULL, NULL, NULL, NULL)
        ''', (request.json['user_id'],))
        order_id = cursor.lastrowid

    # Insert the new items into the existing or newly created order
    for item in request.json['items']:
        cursor.execute(''' 
            INSERT INTO order_items(order_id, drink_id, name, size, quantity, drink_price, toppings, ice_level, sugar_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            order_id, item['drink_id'], item['name'], item['size'], item['quantity'],
            item['drink_price'], item.get('toppings', ''), item.get('ice_level', ''), item.get('sugar_level', '')
        ))
    affected = db.total_changes
    db.commit()
    db.close()
    response = {
        'affected': affected,
        'message': 'Items added to the order',
        'order_id': order_id
    }
    return jsonify(response), 201


# update order without touch order_items
@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    if not request.json:
        abort(400)

    data = request.json

    # Validate order_id match
    if 'order_id' not in data or int(data['order_id']) != order_id:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    # Check if order exists
    cursor.execute('SELECT * FROM orders WHERE order_id=?', (order_id,))
    if not cursor.fetchone():
        db.close()
        return jsonify({'message': 'Order not found'}), 404

    # Update only the orders table
    cursor.execute('''
        UPDATE orders SET
            user_id = ?,
            phone = ?,
            order_type = ?,
            total_price = ?,
            order_time = ?,
            address = ?
        WHERE order_id = ?
    ''', (
        data['user_id'],
        data['phone'],
        data['order_type'],
        data['total_price'],
        datetime.now().isoformat(),
        data['address'],
        order_id,
    ))

    db.commit()
    affected = db.total_changes
    db.close()

    return jsonify({'message': 'Order updated', 'order_id': order_id, 'affected': affected}), 200


# update order_items by order_id and drink_id
@app.route('/api/order_items/order/<int:order_id>/drink/<int:drink_id>', methods=['PUT'])
def update_order_item(order_id, drink_id):
    if not request.json:
        abort(400)

    data = request.json

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    # Check if the order item exists
    cursor.execute('''
        SELECT * FROM order_items WHERE order_id = ? AND drink_id = ?
    ''', (order_id, drink_id))
    if not cursor.fetchone():
        db.close()
        return jsonify({'message': 'Order item not found'}), 404

    # Update the order item
    cursor.execute('''
        UPDATE order_items SET 
            name = ?, 
            size = ?, 
            quantity = ?, 
            drink_price = ?, 
            toppings = ?, 
            ice_level = ?, 
            sugar_level = ?
        WHERE order_id = ? AND drink_id = ?
    ''', (
        data['name'], data['size'], data['quantity'], data['drink_price'],
        data.get('toppings', ''), data.get('ice_level', ''), data.get('sugar_level', ''),
        order_id, drink_id
    ))

    db.commit()
    affected = db.total_changes
    db.close()

    return jsonify({'message': 'Order item updated', 'affected': affected}), 200


# delete order_items by order_id and drink_id
@app.route('/api/order_items/order/<int:order_id>/drink/<int:drink_id>', methods=['DELETE'])
def delete_order_item(order_id, drink_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM order_items WHERE order_id = ? AND drink_id = ?', (order_id, drink_id))
    affected = cursor.rowcount

    db.commit()
    db.close()

    return jsonify({'message': f'Deleted item with order_id {order_id} and drink_id {drink_id}', 'affected': affected}), 200


if __name__ == '__main__':
    socketio.run(app, debug='true')
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port, debug=True)