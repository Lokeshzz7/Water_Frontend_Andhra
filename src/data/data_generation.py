import json
import random

# States data
states = [
    { 'label': 'Chandigarh', 'value': 0 },
    { 'label': 'Arunachal Pradesh', 'value': 1 },
    { 'label': 'Odisha', 'value': 2 },
    { 'label': 'Manipur', 'value': 3 },
    { 'label': 'Rajasthan', 'value': 4 },
    { 'label': 'Bihar', 'value': 5 },
    { 'label': 'Telangana', 'value': 6 },
    { 'label': 'Puducherry', 'value': 7 },
    { 'label': 'Lakshadweep', 'value': 8 },
    { 'label': 'Ladakh', 'value': 9 },
    { 'label': 'Kerala', 'value': 10 },
    { 'label': 'Andaman and Nicobar Islands', 'value': 11 },
    { 'label': 'Maharashtra', 'value': 12 },
    { 'label': 'Uttar Pradesh', 'value': 13 },
    { 'label': 'Mizoram', 'value': 14 },
    { 'label': 'Uttarakhand', 'value': 15 },
    { 'label': 'Andhra Pradesh', 'value': 16 },
    { 'label': 'Haryana', 'value': 17 },
    { 'label': 'Dadra and Nagar Haveli', 'value': 18 },
    { 'label': 'Himachal Pradesh', 'value': 19 },
    { 'label': 'Karnataka', 'value': 20 },
    { 'label': 'Jammu and Kashmir', 'value': 21 },
    { 'label': 'Chhattisgarh', 'value': 22 },
    { 'label': 'Meghalaya', 'value': 23 },
    { 'label': 'Delhi', 'value': 24 },
    { 'label': 'Tripura', 'value': 25 },
    { 'label': 'West Bengal', 'value': 26 },
    { 'label': 'Assam', 'value': 27 },
    { 'label': 'Madhya Pradesh', 'value': 28 },
    { 'label': 'Nagaland', 'value': 29 },
    { 'label': 'Goa', 'value': 30 },
    { 'label': 'Daman and Diu', 'value': 31 },
    { 'label': 'Jharkhand', 'value': 32 },
    { 'label': 'Sikkim', 'value': 33 },
    { 'label': 'Tamil Nadu', 'value': 34 },
    { 'label': 'Gujarat', 'value': 35 },
    { 'label': 'Punjab', 'value': 36 }
]

# Function to generate random data for each state and year
def generate_random_data():
    return {
        'currentStorage': random.uniform(0, 1000),  # Random value for current storage
        'currentCapacity': random.uniform(0, 1000),  # Random value for current capacity
        'waterLevel': random.uniform(0, 500),  # Random value for water level
        'consumption': random.uniform(0, 500),  # Random value for consumption
        'riskScore': random.uniform(0, 10),  # Random value for risk score
        'domesticUse': random.uniform(0, 100),  # Random value for domestic use
        'irrigation': random.uniform(0, 200),  # Random value for irrigation
        'industrialUse': random.uniform(0, 100),  # Random value for industrial use
        'hydroelectricPowerGeneration': random.uniform(0, 500),  # Random value for hydroelectric power generation
        'other': random.uniform(0, 100)  # Random value for other
    }

# Main function to generate data for all states and years
def generate_state_data():
    output_data = []

    for state in states:
        for year in range(2000, 2026):  # For years from 2000 to 2025
            data = generate_random_data()
            data['state'] = state['label']
            data['index'] = state['value']
            data['year'] = year
            output_data.append(data)

    return output_data

# Generate the data
state_data = generate_state_data()

# Write the output to a JSON file
with open('reservoir_fake_data.json', 'w') as f:
    json.dump(state_data, f, indent=2)

print('Data generated successfully and written to state_water_data.json')
