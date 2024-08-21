// TODO 待删除

import * as ts from "typescript"
import fs from "fs-extra"

const filePath = "path/to/your/file.ts"
const sourceCode = fs.readFileSync(filePath, "utf-8")

function parseTypeScriptFile(filePath: string, sourceCode: string): ts.Node {
  const result = ts.transpileModule(sourceCode, {
    fileName: filePath,
    compilerOptions: {target: ts.ScriptTarget.Latest, module: ts.ModuleKind.CommonJS}
  })

  return ts.createSourceFile(filePath, result.outputText, ts.ScriptTarget.Latest, true)
}

function transformAST(ast: ts.Node) {
  return ts.visitNode(ast, function walker(node) {
    if (ts.isIdentifier(node)) {
      const text = node.text
      const transformedText = text.replace(/A/g, "B")
      return ts.factory.createIdentifier(transformedText)
    }
    return ts.visitEachChild(node, walker, null)
  })
}

function generateCode(ast: ts.SourceFile): string {
  const printer = ts.createPrinter()
  return printer.printFile(ast)
}

const ast = parseTypeScriptFile(filePath, sourceCode)
const transformedAST = transformAST(ast)
const updatedCode = generateCode(transformedAST)

console.log(updatedCode)
