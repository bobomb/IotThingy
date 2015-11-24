import paho.mqtt.client as mqtt

#callback when client recieves conacck resp from the server
def on_connect(client, userdata, flacts, rc):
    print("connected with result code " + str(rc))
    client.subscribe("love/#")
    
#self explanatory
def on_message(client, userdata, msg):
    print(msg.topic, " ", str(msg.payload))

#main code starts here
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("localhost", 1883, 60)
#main client loop
client.loop_forever()
