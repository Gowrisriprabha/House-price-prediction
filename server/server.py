from flask import Flask, request, jsonify
from flask_cors import CORS
import util

app = Flask(__name__)
CORS(app)

util.load_saved_artifacts()


@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        "locations": util.get_location_names()
    })
    response.headers.add("Access-Control-Allow-Origin", '*')
    return response


@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    try:
        # Parse JSON payload
        data = request.get_json()
        print(f"Received data: {data}")

        # Ensure the data format is correct
        total_sqft = float(data.get('total_sqft', 0))
        location = data.get('location', '')
        bhk = int(data.get('bhk', 0))
        bath = int(data.get('bath', 0))

        print(f"Parsed Data - Total Sqft: {total_sqft}, Location: {location}, BHK: {bhk}, Bath: {bath}")

        # Get estimated price
        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        print(f"Estimated Price: {estimated_price}")

        response = jsonify({
            'estimated_price': estimated_price
        })
        response.headers.add("Access-Control-Allow-Origin", '*')
        return response

    except Exception as e:
        print(f"Error: {e}")
        response = jsonify({
            'error': str(e)
        })
        response.headers.add("Access-Control-Allow-Origin", '*')
        return response, 400


if __name__ == '__main__':
    print("Starting Python Flask server for Bangalore house price prediction...")
    app.run(debug=True)
