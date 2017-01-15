import cv2
import os

data_source = os.path.join("..", "data")

def overlay_face(imagePath, imageOverlay = os.path.join(data_source, 'overlays', 'dog_face_tongue.png'),
    test=True, ret = "out.jpg"):

    if test:
        face_cascade = cv2.CascadeClassifier(
            os.path.join(data_source,
            'haarcascades',
            'haarcascade_frontalface_default.xml'))
    else:
        face_cascade = cv2.CascadeClassifier(
            os.path.join('data',
            'haarcascades',
            'haarcascade_frontalface_default.xml'))

    overlay = cv2.imread(imageOverlay, -1)
    # Create the mask for the overlay
    orig_mask = overlay[:,:,3]

    # Create the inverted mask for the overlay
    orig_mask_inv = cv2.bitwise_not(orig_mask)

    # Convert overlay image to BGR
    # and save the original image size (used later when re-sizing the image)
    overlay = overlay[:,:,0:3]

    orig_h, orig_w = overlay.shape[:2]

    image = cv2.imread(imagePath)
    limit_h, limit_w = image.shape[:2]

    gray_scale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Detect faces in the image
    faces = face_cascade.detectMultiScale(
        gray_scale,
        scaleFactor=1.1,
        minNeighbors=5,
        flags = cv2.CASCADE_SCALE_IMAGE
    )

    # Draw a rectangle around the faces
    # found from http://sublimerobots.com/2015/02/dancing-mustaches/
    for (nx, ny, nw, nh) in faces:
        #cv2.rectangle(image, (nx, ny), (nx+nw, ny+nh), (0, 255, 0), 2)

        roi_gray = gray_scale[ny:ny+nh, nx:nx+nw]
        roi_color = image[ny:ny+nh, nx:nx+nw]

        overlay_w = nw*.75
        overlay_h = overlay_w*1.2 * orig_h / orig_w

        # Center image on the center of the face
        x1 = int(nx - (overlay_w/2)-overlay_w/12)
        x2 = int(nx + nw + (overlay_w/2)-overlay_w/12)
        y1 = int(ny + nh - (overlay_h/2)-overlay_h/3)
        y2 = int(ny + nh + (overlay_h/2)-overlay_h/3)

        # Check for clipping
        if x1 < 0:
            x1 = 0
        if y1 < 0:
            y1 = 0
        if x2 > limit_w:
            x2 = limit_w
        if y2 > limit_h:
            y2 = limit_h


        # Re-calculate the width and height of the overlay
        overlay_w = x2 - x1
        overlay_h = y2 - y1

        # print nw
        # print nh
        #
        # print "----"
        #
        # print overlay_w
        # print overlay_h
        #
        # print (nx, ny, nw, nh)
        # print (x1, x2, y1, y2)


        # Re-size the original image
        overlayToUse = cv2.resize(overlay, (overlay_w, overlay_h),
            interpolation = cv2.INTER_AREA)
        mask = cv2.resize(orig_mask, (overlay_w, overlay_h),
            interpolation = cv2.INTER_AREA)
        mask_inv = cv2.resize(orig_mask_inv, (overlay_w, overlay_h),
            interpolation = cv2.INTER_AREA)

        roi = image[y1:y2, x1:x2]

        roi_bg = cv2.bitwise_and(roi, roi, mask = mask_inv)

        roi_fg = cv2.bitwise_and(overlayToUse, overlayToUse, mask = mask)

        # join the roi_bg and roi_fg
        dst = cv2.add(roi_bg,roi_fg)

        # place the joined image, saved to dst back over the original image
        image[y1:y2, x1:x2] = dst

    res = ""
    print imagePath
    os.remove(imagePath)
    if len(faces) > 0:
        if test:
            res = os.path.join(data_source,
                'test_output', 'output.jpg')
            cv2.imwrite(res, image)
        else:
            res = os.path.join('data', 'created', ret + ".jpg")
            cv2.imwrite(res, image)
        return res
    return "no_faces"


if __name__ == '__main__':
    overlay_face(os.path.join(data_source, 'test_data', 'test.jpg'))
