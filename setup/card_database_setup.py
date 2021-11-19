import sqlite3
import csv

conn = sqlite3.connect("../data/Cards.db")
c =  conn.cursor()

### Creating Tables
conn.execute("CREATE TABLE IF NOT EXISTS Activities(id INTEGER PRIMARY KEY AUTOINCREMENT, stage INT, number INT, image TEXT, title TEXT, description TEXT, placement TEXT)")
conn.execute("CREATE TABLE IF NOT EXISTS Events(id INTEGER PRIMARY KEY AUTOINCREMENT, stage INT, number INT, title TEXT, description TEXT, requirement TEXT, effect TEXT)")

 

### Inserting Data
add_activity = "INSERT INTO Activities(id,stage,number,image,title,description,placement) VALUES (?,?,?,?,?,?,?)"
#add_event = "INSERT INTO Events(id,stage,number,image,title,description,requirement,effect) VALUES (?,?,?,?,?,?,?,?)"

with open("../data/Activities.csv") as file:
	reader = csv.reader(file)
	for row in reader:
		c.execute(add_activity,row)


"""
#Connecting to database and creating a cursor to navigate the database
conn = sqlite3.connect("data/MouseDatabase.db")
cursor = conn.cursor()

sql_embed = "INSERT INTO Embeds(name, emoji, colour) VALUES (?,?,?)"
sql_theme = "INSERT INTO Themes(name, emoji, coinEmbed, coinTheme) VALUES (?,?,?,?)"

#making lists of data to be added
values_embeds = []
values_embeds.append(["Red","<:red:837765748670857287>","#FF0600"])
values_embeds.append(["Orange","<:orange:837765758406230077>","#FF8000"])
values_embeds.append(["Yellow","<:yellow:837765888802947092>","#FFED00"])
values_embeds.append(["Green","<:green:837765897003073636>","#00FF1A"])
values_embeds.append(["Blue","<:blue:837765904845635646>","#00EFFF"])
values_embeds.append(["Purple","<:purple:837765914052263956>","#4D00FF"])
values_embeds.append(["Pink","<:pink:837765922013708298>","#FF00F9"])

values_themes = []
values_themes.append(["Mouse",":mouse2:",":cheese:",":peanuts:"])
values_themes.append(["Frog",":frog:",":fly:",":cricket:"])
values_themes.append(["Spider",":spider:",":mosquito:",":butterfly:"])
values_themes.append(["Duck",":duck:",":bread:",":snail:"])

#inserting data
for v in values_embeds:
	cursor.execute(sql_embed,v)
for v in values_themes:
	cursor.execute(sql_theme,v)

conn.commit()
cursor.close()
conn.close()
"""


conn.commit()
c.close()
conn.close()
