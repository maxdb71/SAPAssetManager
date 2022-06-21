import Logger from './Logger';
export default function InitializeLogger(clientAPI) {
  // Log file is located in Application's Documents folder.
    Logger.init(clientAPI);
}

