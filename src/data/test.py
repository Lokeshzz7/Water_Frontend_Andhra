


import pandas as pd
import json

# Load the data into a pandas DataFrame
file_path = "rain_evap_pop.csv"  # Replace with the path to your CSV file
data = pd.read_csv(file_path)

# Ensure the necessary columns are present
required_columns = ["Year", "Month", "district_id", "Total Evaporation (mm)", "Normal (mm)", "Population"]
if not all(col in data.columns for col in required_columns):
    raise ValueError(f"Missing one or more required columns: {required_columns}")

# Process the data
result = {}
for _, row in data.iterrows():
    district_id = int(row["district_id"])  # Convert district_id to an integer
    month_data = {
        "Year": row["Year"],
        "Month": row["Month"],
        "Total Evaporation": row["Total Evaporation (mm)"],
        "Normal Rainfall": row["Normal (mm)"],
        "Population": row["Population"]
    }
    if district_id not in result:
        result[district_id] = []
    result[district_id].append(month_data)

# Save to a JSON file
output_file = "rain_evap_pop.json"
with open(output_file, "w") as json_file:
    json.dump(result, json_file, indent=4)

print(f"Processed data has been saved to {output_file}")

