import Logger from '../../Log/Logger';

export default class {

    static setString(context, key, value) {
        try {
            context.nativescript.appSettingsModule.setString(key, value);
        } catch (error) {
            Logger.error('ApplicationSettings - setString', error);
        }
    }

    static setBoolean(context, key, value) {
        try {
            context.nativescript.appSettingsModule.setBoolean(key, Boolean(value));
        } catch (error) {
            Logger.error('ApplicationSettings - setBoolean', error);
        }
    }

    static setNumber(context, key, value) {
        try {
            context.nativescript.appSettingsModule.setNumber(key, Number(value));
        } catch (error) {
            Logger.error('ApplicationSettings - setNumber', error);
        }
    }

    static getString(context, key) {
        try {
            if (context.nativescript.appSettingsModule.hasKey(key)) {
                return context.nativescript.appSettingsModule.getString(key);
            }
        } catch (error) {
            Logger.error('ApplicationSettings - getString', error);
        }
        return '';
    }

    static getBoolean(context, key) {
        try {
            if (context.nativescript.appSettingsModule.hasKey(key)) {
                return context.nativescript.appSettingsModule.getBoolean(key);
            }
        } catch (error) {
            Logger.error('ApplicationSettings - getBoolean', error);
        }
        return '';
    }

    static getNumber(context, key) {
        try {
            if (context.nativescript.appSettingsModule.hasKey(key)) {
                return context.nativescript.appSettingsModule.getNumber(key);
            }
        } catch (error) {
            Logger.error('ApplicationSettings - getNumber', error);
        }
        return '';
    }

    static remove(context, key) {
        try {
            if (context.nativescript.appSettingsModule.hasKey(key)) {
                context.nativescript.appSettingsModule.remove(key);
            }
        } catch (error) {
            Logger.error('ApplicationSettings - remove', error);
        }
    }

    static clear(context) {
        try {
            context.nativescript.appSettingsModule.clear();
        } catch (error)  {
            Logger.error('ApplicationSettings - clear', error);
        }
    }
}
