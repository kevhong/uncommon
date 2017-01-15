import cv2
import os

data_source = os.path.join("..", "data")

def find_face(imagePath, imageOverlay=""):

    face_cascade = cv2.CascadeClassifier(
        os.path.join(data_source,
        'haarcascades',
        'haarcascade_frontalface_default.xml'))

    image = cv2.imread(imagePath)
    gray_scale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Detect faces in the image
    faces = face_cascade.detectMultiScale(
        gray_scale,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )

    print 'Found {0} faces!'.format(len(faces))

    # Draw a rectangle around the faces
    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)

    cv2.imwrite(os.path.join(data_source,
        'test_output', 'output.jpg'), image)


if __name__ == '__main__':
    find_face(os.path.join(data_source, 'test_data', 'test.jpg'))
