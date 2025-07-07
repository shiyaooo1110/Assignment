# # need to install the packages below
# pip install ultralytics
# pip install roboflow   
# pip install ipython

import ultralytics
ultralytics.checks()

from ultralytics import YOLO
from IPython.display import Image

from roboflow import Roboflow
rf = Roboflow(api_key="SAK0RUgU98thRwLvlo1h")
project = rf.workspace("tunku-abdul-rahman-university-of-management-and-technology-ttt1n").project("wood-defects-8lcdv")
version = project.version(7)
dataset = version.download("yolov11")
                
model = YOLO('yolo11n.pt')
model.train(data='Wood-Defects-7/data.yaml', epochs=8, imgsz=640)
# # results of YOLOv11 inside the train8, train9 and train10 folder

# yolo task=detect mode=val model="runs\detect\train8\weights\best.pt" data=Wood-Defects-7/data.yaml
# # Results saved to runs\detect\val3

# yolo task=detect mode=predict model="runs\detect\train8\weights\best.pt" conf=0.25 source=Wood-Defects-7\test\images save=True
# # Results saved to runs\detect\predict3