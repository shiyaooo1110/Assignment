# # need to install the packages below
# pip install ultralytics
# pip install roboflow   
# pip install ipython

import ultralytics
ultralytics.checks()

from ultralytics import YOLO
from IPython.display import Image, display

# import dataset
from roboflow import Roboflow
rf = Roboflow(api_key="UBlf713RmivxrohpL8GX")
project = rf.workspace("tunku-abdul-rahman-university-of-management-and-technology-ttt1n").project("wood-defects-8lcdv")
version = project.version(7)
dataset = version.download("yolov11")

# # run in terminal to train model
# yolo task=detect mode=train data=Wood-Defects-7/data.yaml model=yolov10n.pt epochs=8 imgsz=640
# # results of YOLOv10 inside the train7 folder

# yolo task=detect mode=val model="runs\detect\train7\weights\best.pt" data=Wood-Defects-7/data.yaml
# # Results saved to runs\detect\val2

# yolo task=detect mode=predict model="runs\detect\train7\weights\best.pt" conf=0.25 source=Wood-Defects-7\test\images save=True
# # Results saved to runs\detect\predict2