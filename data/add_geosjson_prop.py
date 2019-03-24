import json
import csv


with open('../json/countries.geojson', 'r') as f:
    geojson = json.load(f)

    with open ('./plastic-waste-generation-total.csv', 'r') as file:
        csv_reader = csv.reader(file, delimiter=',')
        #Loop over GeoJSON features and add the new properties

        for line in csv_reader:
            for feat in geojson['features']:
                if line[0] == feat["properties"]["name"]:
                    feat["properties"]["mismanaged-waste"] = float(line[3])


        for country in geojson['features']:
            try:
               val = country["properties"]["mismanaged-waste"]
            except:
                print country["properties"]["name"]

#Write result to a new file
with open('countries-plastic-waste-total.geojson', 'w') as f:
    json.dump(geojson, f)