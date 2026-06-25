import {Data, Plugins} from 'phaser';

export default class SaveManager extends Plugins.BasePlugin {
    public static readonly PLUGIN_KEY: string = 'SaveManager';
    public static readonly MAPPING_NAME: string = 'saveManager';
    private static readonly LOCAL_STORAGE_KEY: string = 'phaserSaveData';

    private readonly _dataManager: Data.DataManager;

    constructor(pluginManager: Plugins.PluginManager) {
        super(pluginManager);

        this._dataManager = new Data.DataManager(this.game);
    }

    destroy() {
        super.destroy();

        this._dataManager.destroy();
    }

    public setData(key: string, value: any, save: boolean = true): void {
        this._dataManager.set(key, value);

        if (save)
            this.save();
    }

    public getData(key: string): any {
        return this._dataManager.get(key);
    }

    public save(): void {
        try {
            // cf. https://docs.phaser.io/phaser/concepts/data-manager#using-json
            const json: string = JSON.stringify(this._dataManager.list);

            localStorage.setItem(SaveManager.LOCAL_STORAGE_KEY, json);
        } catch (error) {
            console.error('[SaveManager] Save failed: ', error);
        }

    }

    public load(): void {
        try {
            const json: string | null = localStorage.getItem(SaveManager.LOCAL_STORAGE_KEY);
            if (!json) {
                console.log('[SaveManager] No data found to load');
                return;
            }

            this._dataManager.reset().merge(JSON.parse(json));

        } catch (error) {
            console.error('[SaveManager] Load failed: ', error);
        }
    }

    public clear(): void {
        this._dataManager.reset();
        localStorage.removeItem(SaveManager.LOCAL_STORAGE_KEY);

    }
}