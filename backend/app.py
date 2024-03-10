from flask import Flask,render_template,request, flash
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key="medbot"

filenames=[]
app.config['UPLOAD_FOLDER']='./static/user_reports'

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

@app.route("/upload")
def upload():
    return render_template('index.html')

@app.route("/save",methods=["POST"])
def save():
    file = request.files['file']
    filename = secure_filename(file.filename)
    filenames.append(filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return render_template("index1.html")

@app.route('/show')
def show():
    return render_template('show.html',filenames=filenames)

if __name__=="__main__":
    app.run(debug=True)

