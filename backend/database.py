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
                    axis_labels TEXT NOT NULL,
                    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    user_id INTEGER,
                    clustering_algorithm TEXT,
                    number_of_clusters INTEGER,
                    outlier_detection TEXT,
                    selected_upload_option TEXT,
                    is_or INTEGER,
                    outlier_Detection_column_start INTEGER,
                    outlier_Detection_column_end INTEGER,
                    FOREIGN KEY (user_id) REFERENCES users(id))''')


  # Check if dummy data exists before inserting
    c.execute("SELECT COUNT(*) FROM users WHERE email='dummy@gmail.com'")
    if c.fetchone()[0] == 0:
        # Insert dummy data into the users table
        c.execute("INSERT INTO users (email, password) VALUES ('dummy@gmail.com', 'dummy_password')")

    
    conn.commit()

    c.execute("select * from users")    
    # c.execute("DELETE FROM plots")      
    rows = c.fetchall()
    for row in rows:
        print(row)

    c.execute("select * from plots")    

    rows1 = c.fetchall()
    for row in rows1:
        print(row)

    conn.close()

