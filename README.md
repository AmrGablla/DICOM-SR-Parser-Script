# DICOM Parser Script

This repository contains a Node.js script that utilizes the `dicom-parser` library to parse DICOM files and extract specific information from them. The script allows you to search for a specific DICOM key and retrieve associated impression text.

## Prerequisites

Before using the script, make sure you have the following prerequisites installed:

- Node.js: You need to have Node.js installed on your system. You can download it from [here](https://nodejs.org/).

## Installation

1. Clone this repository to your local machine using the following command:

   ```
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Navigate to the project directory:

   ```
   cd your-repo-name
   ```

3. Install the required dependencies by running:

   ```
   npm install
   ```

## Usage

To use the script, follow these steps:

1. Place your DICOM file in the project directory.

2. Open a terminal and navigate to the project directory.

3. Run the script with the following command:

   ```
   node index.js path/to/your/dicom/file.dcm [targetKey]
   ```

   Replace `index.js` with the name of the script file if you've renamed it. Replace `path/to/your/dicom/file.dcm` with the actual path to your DICOM file. You can also provide an optional `targetKey` parameter to specify the key you want to search for (default is "QURE_CODE_12").

4. The script will output the extracted impression text if the specified key is found, or a message indicating that the key was not found.

## Example

Here's an example of how you can use the script:

```
node index.js mydicomfile.dcm QURE_CODE_12
```

## Troubleshooting

If you encounter any issues while using the script, make sure you have provided the correct path to your DICOM file and that the required dependencies are properly installed.

## Disclaimer

This script is provided as-is and may not cover all possible scenarios. Use it responsibly and ensure you have the necessary rights to access and parse the DICOM files you're working with.

## Credits

The script utilizes the `dicom-parser` library. Credits and thanks to the authors of the library for their work.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
