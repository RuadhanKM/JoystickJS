const cam = new JJS_Cam()
addSceneObject(cam)
cam.Transform.Size = new Vec2(1280, 720)
cam.Camera.renderToScreen = true

updateSceneList()
updateComponents()