figma.showUI(__html__, {
  width: 960,
  height: 640,
  title: "Before & After Slider"
});

async function run() {
  const selection = figma.currentPage.selection;

  if (selection.length !== 2) {
    figma.ui.postMessage({
      type: "error",
      message: "Select exactly 2 frames before running the plugin."
    });
    return;
  }

  try {
    const [frameB, frameA] = selection;

    const bytesA = await frameA.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 2 } });
    const bytesB = await frameB.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 2 } });

    figma.ui.postMessage({
      type: "images",
      before: Array.from(bytesA),
      after: Array.from(bytesB),
      beforeName: frameA.name,
      afterName: frameB.name
    });
  } catch (e) {
    figma.ui.postMessage({
      type: "error",
      message: "Could not export the frames. Make sure you selected actual frames (not groups or components)."
    });
  }
}

run();

figma.ui.onmessage = (msg) => {
  if (msg.type === "close") figma.closePlugin();
  if (msg.type === "reload") run();
  if (msg.type === "resize") figma.ui.resize(msg.width, msg.height);
};
