import  fs from 'fs-extra';

const DEFAULT_ASSETS_ROOT_PATH = './public/assets/defaults';
const LOCALIZED_ASSETS_ROOT_PATH = './public/assets/localized';

function indent(level) {
    return '\t'.repeat(level);
}

function isNumber(input) {
    return '[object Number]' === Object.prototype.toString.call(input) && !isNaN(input);
}

function safePropertyName(name) {

    name = name.replace(/^[^0-9A-Za-z_]+|\W+/g, '_');

    if(isNumber(parseInt(name[0]))) {
        return '_' + name;
    } else {
        return name;
    }
}

function generateForFolder(folderPath, folderName, indentationLevel) {
    return indent(indentationLevel)
        + safePropertyName(folderName)
        + ': {\n'
        + generateObjectProperties(folderPath, indentationLevel)
        + '\n'
        + indent(indentationLevel)
        + '},';
}

function generateForFile(filePath: string, fileName: string, indentationLevel: number) {
    const fileRelativePath = extractAssetRelativePath(filePath);
    return indent(indentationLevel) + safePropertyName(fileName) + `: new Asset('${fileRelativePath}', assetsResolver${getLocalizations(fileRelativePath)}),`;
}

function extractAssetRelativePath(filePath: string) {
    return filePath.substring(DEFAULT_ASSETS_ROOT_PATH.length + 1)
}

function getLocalizations(fileRelativePath: string) {
    const localizations: string[] = [];
    fs.readdirSync(LOCALIZED_ASSETS_ROOT_PATH).forEach(localizationFolder => {
        const localizedFilePath = LOCALIZED_ASSETS_ROOT_PATH + '/' + localizationFolder + '/' + fileRelativePath;
        if(fs.existsSync(localizedFilePath)) {
            localizations.push(`"${localizationFolder}"`);
        }
    });

    if(localizations.length === 0) {
        return '';
    }

    return ', [' + localizations.join(', ') + ']';
}

function generateObjectProperties(folderPath, indentationLevel) {
    const linesOfCode: string[] = [];

    fs.readdirSync(folderPath).forEach(subPath => {
        const fullSubPath = folderPath + '/' + subPath;
        const stat = fs.statSync(fullSubPath);
        if(stat.isFile()) {
            linesOfCode.push(generateForFile(fullSubPath, subPath, indentationLevel + 1))
        } else {
            linesOfCode.push(generateForFolder(fullSubPath, subPath, indentationLevel + 1));
        }
    });

    return linesOfCode.join('\n');
}

function generateAssetsMap() {
    const linesOfCode: string[] = [];
    linesOfCode.push('import {Asset} from "./asset";');
    linesOfCode.push('import {IAssetResolver} from "./asset-resolver.interface";');
    linesOfCode.push('export function makeAssets(assetsResolver: IAssetResolver) {');
    linesOfCode.push('\treturn {')
    fs.readdirSync(DEFAULT_ASSETS_ROOT_PATH).forEach(subPath => {
        linesOfCode.push(generateForFolder(DEFAULT_ASSETS_ROOT_PATH + '/' + subPath, subPath, 2));
    });
    linesOfCode.push('\t}')
    linesOfCode.push('}')

    fs.writeFileSync('./src/app/theme/make-assets.ts', linesOfCode.join('\n'));
}

generateAssetsMap();


