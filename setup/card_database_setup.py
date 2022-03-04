import sqlite3
import csv

conn = sqlite3.connect("./data/Cards.db")
c =  conn.cursor()


### Creating Tables
conn.execute("CREATE TABLE IF NOT EXISTS Activities(id INT PRIMARY KEY, stage INT, number INT, image TEXT, title TEXT, description TEXT, placement TEXT)")
conn.execute("CREATE TABLE IF NOT EXISTS Events(id INT PRIMARY KEY, stage INT, image TEXT, title TEXT, description TEXT, save_condition TEXT, requirement TEXT, effect TEXT, else_condition TEXT)")

 

### Inserting Data
add_activity = "INSERT INTO Activities(id,stage,number,image,title,description,placement) VALUES (?,?,?,?,?,?,?)"
add_event = "INSERT INTO Events(id,stage,image,title,description,save_condition,requirement,effect,else_condition) VALUES (?,?,?,?,?,?,?,?,?)"

with open("./data/Activities.csv") as file:
	reader = csv.reader(file)
	for row in reader:
		c.execute(add_activity,row)

with open("./data/Events.csv") as file:
	reader = csv.reader(file)
	for row in reader:
		c.execute(add_event,row)

conn.commit()
c.close()
conn.close()
