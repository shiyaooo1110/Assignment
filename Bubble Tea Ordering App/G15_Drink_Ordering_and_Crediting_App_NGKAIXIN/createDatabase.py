import sqlite3
from datetime import datetime

# Connect to the database
db = sqlite3.connect('db.sqlite')

db.execute('DROP TABLE IF EXISTS drinks')
db.execute('''CREATE TABLE drinks(
    id integer PRIMARY KEY,
    title text NOT NULL,
    category text NOT NULL,
    price text NOT NULL,
    description text NOT NULL
)''')

db.execute('DROP TABLE IF EXISTS users')
db.execute('''
    CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL
)''')

db.execute('DROP TABLE IF EXISTS orders')
db.execute('''
    CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        phone TEXT,
        order_type TEXT,
        total_price REAL,
        order_time TEXT,
        address TEXT, 
        FOREIGN KEY(phone) REFERENCES users(phone)
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
''')

db.execute('DROP TABLE IF EXISTS order_items')
db.execute('''
    CREATE TABLE order_items (
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        drink_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        size TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        drink_price REAL NOT NULL,
        toppings TEXT NOT NULL,
        ice_level TEXT NOT NULL,
        sugar_level TEXT NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(order_id)
    )
''')

cursor = db.cursor()

# insert data 
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES('Brown Sugar Boba Tea','Milk Tea','RM 12.90','Fresh milk with brown sugar syrup and warm boba')''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Matcha Bubble Tea","Milk Tea","RM 13.90","Japanese matcha with creamy milk and pearls")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Red Bean Bubble Tea","Milk Tea","RM 12.50","Creamy milk tea with sweet red beans and chewy boba")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Strawberry Milk Tea","Milk Tea","RM 12.90","Fresh strawberry flavor mixed with milk tea and pearls")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Taro Bubble Tea","Milk Tea","RM 12.50","Sweet, creamy taro blended with milk and pearls")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Chocolate Bubble Tea","Milk Tea","RM 12.50","Rich chocolate milk tea with boba for extra indulgence")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Honey Lemon Tea","Fruit Tea","RM 10.90","Tangy lemon and floral honey in a refreshing tea")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Kiwi Green Tea","Fruit Tea","RM 11.90","Sweet and tart kiwi flavor with green tea")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Lychee Jasmine Tea","Fruit Tea","RM 11.90","Fragrant jasmine tea with juicy lychee infusion")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Passion Fruit Tea","Fruit Tea","RM 11.90","Zesty passion fruit in a bold tea base")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Peach Oolong Tea","Fruit Tea","RM 11.90","Ripe peach blended into floral oolong tea")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Orange Jasmine Tea","Fruit Tea","RM 11.50","Bright orange citrus paired with jasmine tea")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Avocado Smoothie","Smoothie","RM 14.90","Creamy avocado with milk and a touch of honey")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Blueberry Smoothie","Smoothie","RM 13.90","Sweet-tart blueberries blended with yogurt")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Mango Smoothie","Smoothie","RM 13.90","Tropical mango blended into a smooth icy treat")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Strawberry Smoothie","Smoothie","RM 13.90","Fresh strawberries blended with milk or yogurt")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Watermelon Smoothie","Smoothie","RM 12.90","Light and hydrating, made with fresh watermelon")''')
cursor.execute('''INSERT INTO drinks(title, category, price, description) VALUES("Carrot Smoothie","Smoothie","RM 12.90","aturally sweet carrot with apple or citrus juice")''')

cursor.execute('''
    INSERT INTO users(username, email, phone, password)
    VALUES('John Tan', 'john.tan@mail.com', '0121112233', '1234')
''')

cursor.execute('''
    INSERT INTO users(username, email, phone, password)
    VALUES('Aisha Rahman', 'aisha.r@mail.com', '0135566778', 'pass123')
''')

cursor.execute('''
    INSERT INTO users(username, email, phone, password)
    VALUES('Kumar Subramaniam', 'kumar.s@mail.com', '0148899776', 'kumar456')
''')

cursor.execute('''
    INSERT INTO users(username, email, phone, password)
    VALUES('Siti Noor', 'siti.noor@mail.com', '0123434543', 'siti2024')
''')

cursor.execute('''
    INSERT INTO users(username, email, phone, password)
    VALUES('Lim Wei Seng', 'wei.seng@mail.com', '0167654321', 'lim999')
''')

# Sample orders
orders = [
    (1, 1, '0121112233', 'pick-up', 25.80, datetime(2025, 5, 5, 13, 0, 0).isoformat(), 'Bubble Tea, Batu 11 Cheras, Balakong, Selangor'),
    (2, 2, '0135566778', 'delivery', 37.70, datetime(2025, 5, 5, 14, 0, 0).isoformat(), 'No 353, Jalan Ai, Batu 11 Cheras, Balakong, Selangor'),
    (3, 3, '0148899776', 'pick-up', 26.80, datetime(2025, 5, 5, 15, 0, 0).isoformat(), 'Bubble Tea, Batu 11 Cheras, Balakong, Selangor'),
    (4, 4, '0123434543', 'delivery', 39.70, datetime(2025, 5, 5, 16, 0, 0).isoformat(), 'No 200, Jalan Poh Ai, Batu 11 Cheras, Balakong, Selangor'),
    (5, 5, '0167654321', 'pick-up', 38.70, datetime(2025, 5, 5, 17, 0, 0).isoformat(), 'Bubble Tea, Batu 11 Cheras, Balakong, Selangor'),
]

cursor.executemany('''
    INSERT INTO orders(order_id, user_id, phone, order_type, total_price, order_time, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
''', orders)

# Sample order items
order_items = [
    (1, 1, 'Brown Sugar Boba Tea', 'Medium', 1, 'RM 12.90', 'Boba', 'Less Ice', 'Half Sugar (50%)'),
    (1, 4, 'Strawberry Milk Tea', 'Large', 1, 'RM 12.90', 'Boba, Pudding', 'Normal Ice', 'Normal Sugar (100%)'),

    (2, 2, 'Matcha Bubble Tea', 'Medium', 1, 'RM 13.90', 'Boba', 'Normal Ice', 'Half Sugar (50%)'),
    (2, 3, 'Red Bean Bubble Tea', 'Large', 1, 'RM 12.50', 'Red Bean', 'Less Ice', 'Normal Sugar (100%)'),
    (2, 7, 'Honey Lemon Tea', 'Medium', 1, 'RM 10.90', 'Aloe Vera', 'No Ice', 'No Added Sugar'),

    (3, 5, 'Taro Bubble Tea', 'Medium', 1, 'RM 12.90', 'Boba', 'Normal Ice', 'Less Sugar (30%)'),
    (3, 6, 'Chocolate Bubble Tea', 'Large', 1, 'RM 12.50', 'Boba', 'Less Ice', 'Half Sugar (50%)'),
    (3, 7, 'Honey Lemon Tea', 'Medium', 1, 'RM 10.90', 'None', 'Normal Ice', 'Less Sugar (30%)'),

    (4, 8, 'Kiwi Green Tea', 'Large', 1, 'RM 11.90', 'Boba', 'Less Ice', 'Half Sugar (50%)'),
    (4, 9, 'Lychee Jasmine Tea', 'Medium', 1, 'RM 11.90', 'Lychee Jelly', 'No Ice', 'Less Sugar (30%)'),
    (4, 10, 'Passion Fruit Tea', 'Large', 1, 'RM 11.90', 'Aloe Vera', 'Normal Ice', 'Half Sugar (50%)'),
    (4, 12, 'Orange Jasmine Tea', 'Medium', 1, 'RM 11.50', 'None', 'Normal Ice', 'Normal Sugar (100%)'),

    (5, 13, 'Avocado Smoothie', 'Medium', 1, 'RM 14.90', 'None', 'No Ice', 'No Added Sugar'),
    (5, 14, 'Blueberry Smoothie', 'Large', 1, 'RM 13.90', 'Chia Seed', 'Less Ice', 'Half Sugar (50%)'),
    (5, 15, 'Mango Smoothie', 'Medium', 1, 'RM 13.90', 'Mango Chunks', 'Normal Ice', 'Normal Sugar (100%)'),
]

for item in order_items:
    cursor.execute('''
        INSERT INTO order_items(order_id, drink_id, name, size, quantity, drink_price, toppings, ice_level, sugar_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', item)

# Commit and close
db.commit()
db.close()