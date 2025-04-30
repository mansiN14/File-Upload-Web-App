from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def log_event(message):
    with open("upload_log.txt", "a") as log:
        log.write(f"[{datetime.now()}] {message}\n")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files or 'category' not in request.form:
        return jsonify({'success': False, 'message': 'Missing file or category'}), 400

    file = request.files['file']
    category = request.form['category']

    if file and allowed_file(file.filename):
        category_path = os.path.join(UPLOAD_FOLDER, category)
        os.makedirs(category_path, exist_ok=True)

        filepath = os.path.join(category_path, file.filename)
        file.save(filepath)

        log_event(f"Uploaded: {file.filename} | Category: {category}")
        return jsonify({'success': True, 'message': 'File uploaded successfully'})
    else:
        log_event(f"Rejected: {file.filename} | Category: {category} | Invalid type")
        return jsonify({'success': False, 'message': 'Invalid file type'}), 400

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=8000)
