import sqlite3

def create_database():

    conn = sqlite3.connect('popMLViz.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL)''')

    c.execute('''CREATE TABLE IF NOT EXISTS plots (
                    id INTEGER PRIMARY KEY,
                    data_plot TEXT NOT NULL,
                    plot_title TEXT NOT NULL,
                    plot TEXT NOT NULL,
                    user_id INTEGER,
                    FOREIGN KEY (user_id) REFERENCES users(id))''')

    c.execute('''CREATE TABLE IF NOT EXISTS clusters (
                    id INTEGER PRIMARY KEY,
                    cluster_name TEXT NOT NULL,
                    color TEXT NOT NULL,
                    plot_id INTEGER,
                    FOREIGN KEY (plot_id) REFERENCES plots(id))''')


  # Check if dummy data exists before inserting
    c.execute("SELECT COUNT(*) FROM users WHERE email='dummy@gmail.com'")
    if c.fetchone()[0] == 0:
        # Insert dummy data into the users table
        c.execute("INSERT INTO users (email, password) VALUES ('dummy@gmail.com', 'dummy_password')")

    # Check if dummy data exists before inserting
    c.execute("SELECT COUNT(*) FROM plots WHERE id=1")
    if c.fetchone()[0] == 0:
        # Insert dummy data into the plots table
        c.execute("INSERT INTO plots (data_plot, plot_title, plot, user_id) VALUES ('data1', 'plot1', 'plot_data1', 1)")

    # Check if dummy data exists before inserting
    c.execute("SELECT COUNT(*) FROM clusters WHERE id=1")
    if c.fetchone()[0] == 0:
        # Insert dummy data into the clusters table
        c.execute("INSERT INTO clusters (cluster_name, color, plot_id) VALUES ('cluster1', 'red', 1)")


    conn.commit()

    c.execute("select * from users")          
    rows = c.fetchall()
    for row in rows:
        print(row)

    conn.close()

