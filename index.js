
const fs = require('fs');
const path = require('path');
const process = require('process');

const _ = require('lodash');
const chalk = require('chalk');
const fse = require('fs-extra');
const log = require('./lib/log');
const ora = require('ora');
const parseString = require('xml2js').parseString;
const jimp = require('jimp');

const { execSync, spawnSync, spawn } = require('child_process');

const CONFIG_FILE_NAME = 'config.xml';

const DPI = {

    splash: {
        ldpi: {
            w: 200,
            h: 320
        },
        mdpi: {
            w: 320,
            h: 480
        },
        hdpi: {
            w: 480,
            h: 800
        },
        xhdpi: {
            w: 720,
            h: 1280
        },
        xxhdpi: {
            w: 960,
            h: 1600
        },
        xxxhdpi: {
            w: 1280,
            h: 1920
        }
    },
    icon: {
        ldpi: {
            w: 36,
            h: 36
        },
        mdpi: {
            w: 48,
            h: 48
        },
        hdpi: {
            w: 72,
            h: 72
        },
        xhdpi: {
            w: 96,
            h: 96
        },
        xxhdpi: {
            w: 144,
            h: 144
        },
        xxxhdpi: {
            w: 192,
            h: 192
        }
    }
};

/**
 * CordovaImageMaker 클래스
 */
class CordovaImageMaker{

    constructor({
        config = '',
        icon = '',
        splash = '',
        quiet = false
    } = {}){

        const root = _.trim(spawnSync('npm', ['root'], {shell: true, encoding: 'utf8'}).stdout.replace('node_modules', ''));

        const _config = path.join(root, CONFIG_FILE_NAME);
        const _icon = path.join(root, 'res/icon.png');
        const _splash = path.join(root, 'res/splash.png');

        this.config = config || _config;
        this.icon = icon || _icon;
        this.splash = splash || _splash;

        this.quiet = quiet;
    }
    /**
     * 이미지 리사이즈 함수
     */
    resize(){

        const config = this.config;

        // icon 이미지 파일 존재 여부
        let existsIconImage = false;
        // splash 이미지 파일 존재 여부
        let existsSplashImage = false;

        if (!fs.existsSync(config)) log.fatal('not exists config file.');

        if (fs.existsSync(this.icon)) existsIconImage = true;
        if (fs.existsSync(this.splash))existsSplashImage = true;

        if (!existsIconImage && !existsSplashImage){
             log.fatal('not exists icon and splash source image file.');
        }

        const xml = fse.readFileSync(config, 'utf-8');

        parseString(xml, (err, result) => {

            const platforms = _.get(result, 'widget.platform');

            _.map(platforms, v => {

                const icon = v.icon || [];
                const splash = v.splash || [];

                existsIconImage && _.forEach(icon, vv => { _resize.call(this, vv, 'icon'); });
                existsSplashImage && _.forEach(splash, vv => { _resize.call(this, vv, 'splash'); });
            });
        });
    }
}

/**
 * 이미지 리사이즈 함수
 *
 * @param $
 * @param type
 * @private
 */
function _resize({$} = {}, type = ''){

    const src = type === 'splash' ? this.splash : this.icon;
    const dist = $.src;
    const density = $.density;

    let spinner = null;

    let w = $.width || 1;
    let h = $.height || 1;

    if (!_.isEmpty(density)){

        const dpiText = _getDPIText(density);

        const dpi = DPI[type][dpiText];

        w = dpi.w;
        h = dpi.h;

        if (type === 'splash' &&
        _isLandScape(density)){

            w = dpi.h;
            h = dpi.w;
        }
    }

    jimp.read(src, (err, image) => {

        if (err) throw err;

        const baseDistFileName = path.parse(dist).base;

        if (!this.quiet) spinner = ora(`resizing ${baseDistFileName} file...`).start();

        image.resize(Number(w), Number(h), (err, image) => {

            image.write(dist);

            !this.quiet && spinner.succeed(`${baseDistFileName} file(${w} * ${h}) resize successed`);
        });
    });
}

/**
 * dpi 문자를 반환한다.
 *
 * @param density
 * @returns {string}
 * @private
 */
function _getDPIText(density = ''){

    let ret = density;
    let separator = '-';

    if (density.indexOf(separator) > -1){
        ret = density.split(separator)[1];
    }

    return ret;
}

/**
 * landscape 이미지 여부를 반환한다.
 *
 * @param v
 * @returns {boolean}
 * @private
 */
function _isLandScape(v = ''){
    return v.indexOf('land') > -1 ? true : false;
}


module.exports = CordovaImageMaker;