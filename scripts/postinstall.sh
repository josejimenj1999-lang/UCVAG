#!/bin/bash

# Clone OpenCL headers if building llama.rn from source
OPENCL_HEADERS_DIR="node_modules/llama.rn/third_party/OpenCL-Headers"
if [ ! -d "$OPENCL_HEADERS_DIR" ]; then
    echo "Cloning OpenCL headers for llama.rn build from source..."
    mkdir -p "node_modules/llama.rn/third_party"
    git clone --depth 1 https://github.com/KhronosGroup/OpenCL-Headers.git "$OPENCL_HEADERS_DIR"
    echo "OpenCL headers cloned successfully."
else
    echo "OpenCL headers already present."
fi

# Apply the ONNX Runtime Gradle compatibility fix.
node <<'NODE'
const fs = require('fs');

const file = 'node_modules/onnxruntime-react-native/android/build.gradle';
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
        /if\s*\(\s*VersionNumber\.parse\(REACT_NATIVE_VERSION\)\s*<\s*VersionNumber\.parse\("0\.71"\)\s*\)/g,
        '  def rnVersionParts = REACT_NATIVE_VERSION.split("\\\\.");\n  if (rnVersionParts[0].toInteger() == 0 && rnVersionParts[1].toInteger() < 71)',
    );
    fs.writeFileSync(file, content, 'utf8');
}
NODE

# Patch GetSymbolicDimensions in ONNX Runtime C++.
node <<'NODE'
const fs = require('fs');

const files = [
    'node_modules/onnxruntime-react-native/cpp/TensorUtils.cpp',
    'node_modules/onnxruntime-react-native/cpp/InferenceSessionHostObject.cpp',
];

for (const file of files) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(
            /\bValue\s+([a-zA-Z0-9_]+)\s*;/g,
            'Value $1(nullptr);',
        );
        content = content.replace(
            /auto\s+symbolicDimensions\s*=\s*tensorInfo(?:\.|->)GetSymbolicDimensions\(\);/g,
            'std::vector<std::string> symbolicDimensions;',
        );
        fs.writeFileSync(file, content, 'utf8');
    }
}
NODE
