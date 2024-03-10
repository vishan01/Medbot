from flask import Flask,render_template
app = Flask(__name__)

@app.route("/login")
def login():
    return render_template('login.html')

@app.route("/register")
def register():
    return render_template('register.html')

@app.route("/GetHelp")
def gethelp():
    return render_template('help.html')

@app.route("/ProvideHelp")
def phelp():
    return render_template('provide.html')

@app.route("/form")
def form():
    return render_template('form.html')

@app.route("/form1")
def form1():
    return render_template('form1.html')

@app.route("/form2")
def form2():
    return render_template('form2.html')


if __name__=="__main__":
    app.run(debug=True)

