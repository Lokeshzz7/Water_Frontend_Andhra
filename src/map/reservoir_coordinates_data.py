import csv
import json


def csv_to_json(csv_file_path, json_file_path):
    result = []

    # Open the CSV file and read it
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Create a dictionary for each row in the required format
            entry = {
                "title": row["Reservoir Name"],
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(row["Longitude"].strip()), float(row["Latitude"].strip())]
                }
            }
            result.append(entry)

    # Save the result as a JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as jsonfile:
        json.dump(result, jsonfile, indent=4)


# Paths to the input CSV file and output JSON file
csv_file = "reservoirs_with_coordinates.csv"  # Replace with your CSV file path
json_file = "reservoir_data_full.json"  # Replace with your desired JSON file path

# Convert CSV to JSON
csv_to_json(csv_file, json_file)

print(f"JSON file has been created at: {json_file}")
