/*
 Copyright 2011 Abdulla Abdurakhmanov
 Original sources are available at https://code.google.com/p/x2js/

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

function X2JS() {
	var VERSION = "1.0.8"

	var DOMNodeTypes = {
		ELEMENT_NODE 	   : 1,
		TEXT_NODE    	   : 3,
		CDATA_SECTION_NODE : 4,
		DOCUMENT_NODE 	   : 9
	}
	
	function getNodeLocalName( node ) {
		var nodeLocalName = node.localName;			
		if(nodeLocalName == null) // Yeah, this is IE!! 
			nodeLocalName = node.baseName;
		if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
			nodeLocalName = node.nodeName;
		return nodeLocalName;
	}
	
	function getNodePrefix(node) {
		return node.prefix;
	}

	function parseDOMChildren( node ) {
		if(node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
			var result = new Object;
			var child = node.firstChild; 
			var childName = getNodeLocalName(child);
			result[childName] = parseDOMChildren(child);
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
			var result = new Object;
			result.__cnt=0;
			
			var nodeChildren = node.childNodes;
			
			// Children nodes
			for(var cidx=0; cidx <nodeChildren.length; cidx++) {
				var child = nodeChildren.item(cidx); // nodeChildren[cidx];
				var childName = getNodeLocalName(child);
				
				result.__cnt++;
				if(result[childName] == null) {
					result[childName] = parseDOMChildren(child);
					result[childName+"_asArray"] = new Array(1);
					result[childName+"_asArray"][0] = result[childName];
				}
				else {
					if(result[childName] != null) {
						if( !(result[childName] instanceof Array)) {
							var tmpObj = result[childName];
							result[childName] = new Array();
							result[childName][0] = tmpObj;
							
							result[childName+"_asArray"] = result[childName];
						}
					}
					var aridx = 0;
					while(result[childName][aridx]!=null) aridx++;
					(result[childName])[aridx] = parseDOMChildren(child);
				}			
			}
			
			// Attributes
			for(var aidx=0; aidx <node.attributes.length; aidx++) {
				var attr = node.attributes.item(aidx); // [aidx];
				result.__cnt++;
				result["_"+attr.name]=attr.value;
			}
			
			// Node namespace prefix
			var nodePrefix = getNodePrefix(node);
			if(nodePrefix!=null && nodePrefix!="") {
				result.__cnt++;
				result.__prefix=nodePrefix;
			}
			
			if( result.__cnt == 1 && result["#text"]!=null  ) {
				result = result["#text"];
			} 
			
			if(result["#text"]!=null) {
				result.__text = result["#text"];
				delete result["#text"];
				delete result["#text_asArray"];
			}
			if(result["#cdata-section"]!=null) {
				result.__cdata = result["#cdata-section"];
				delete result["#cdata-section"];
				delete result["#cdata-section_asArray"];
			}
			
			if(result.__text!=null || result.__cdata!=null) {
				result.toString = function() {
					return (this.__text!=null? this.__text:'')+( this.__cdata!=null ? this.__cdata:'');
				}
			}
			return result;
		}
		else
		if(node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
			return node.nodeValue;
		}	
	}
	
	function startTag(jsonObj, element, attrList, closed) {
		var resultStr = "<"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"") + element;
		if(attrList!=null) {
			for(var aidx = 0; aidx < attrList.length; aidx++) {
				var attrName = attrList[aidx];
				var attrVal = jsonObj[attrName];
				resultStr+=" "+attrName.substr(1)+"='"+attrVal+"'";
			}
		}
		if(!closed)
			resultStr+=">";
		else
			resultStr+="/>";
		return resultStr;
	}
	
	function endTag(jsonObj,elementName) {
		return "</"+ (jsonObj.__prefix!=null? (jsonObj.__prefix+":"):"")+elementName+">";
	}
	
	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}
	
	function jsonXmlSpecialElem ( jsonObj, jsonObjField ) {
		if(endsWith(jsonObjField.toString(),("_asArray")) 
				|| jsonObjField.toString().indexOf("_")==0 
				|| (jsonObj[jsonObjField] instanceof Function) )
			return true;
		else
			return false;
	}
	
	function jsonXmlElemCount ( jsonObj ) {
		var elementsCnt = 0;
		if(jsonObj instanceof Object ) {
			for( var it in jsonObj  ) {
				if(jsonXmlSpecialElem ( jsonObj, it) )
					continue;			
				elementsCnt++;
			}
		}
		return elementsCnt;
	}
	
	function parseJSONAttributes ( jsonObj ) {
		var attrList = [];
		for( var ait in jsonObj  ) {
			if(ait.toString().indexOf("__")== -1 && ait.toString().indexOf("_")==0) {
				attrList.push(ait);
			}
		}
		return attrList;
	}
	
	function parseJSONTextAttrs ( jsonTxtObj ) {
		var result ="";
		
		if(jsonTxtObj.__cdata!=null) {										
			result+="<![CDATA["+jsonTxtObj.__cdata+"]]>";					
		}
		
		if(jsonTxtObj.__text!=null) {
			result+=jsonTxtObj.__text;
		}
		return result
	}
	
	function parseJSONTextObject ( jsonTxtObj ) {
		var result ="";

		if( jsonTxtObj instanceof Object ) {
			result+=parseJSONTextAttrs ( jsonTxtObj )
		}
		else
			if(jsonTxtObj!=null)
				result+=jsonTxtObj;
		
		return result;
	}
	
	function parseJSONArray ( jsonArrRoot, jsonArrObj, attrList ) {
		var result = ""; 
		if(jsonArrRoot.length == 0) {
			result+=startTag(jsonArrRoot, jsonArrObj, attrList, true);
		}
		else {
			for(var arIdx = 0; arIdx < jsonArrRoot.length; arIdx++) {
				result+=startTag(jsonArrRoot[arIdx], jsonArrObj, parseJSONAttributes(jsonArrRoot[arIdx]), false);
				result+=parseJSONObject(jsonArrRoot[arIdx]);
				result+=endTag(jsonArrRoot[arIdx],jsonArrObj);						
			}
		}
		return result;
	}
	
	function parseJSONObject ( jsonObj ) {
		var result = "";	

		var elementsCnt = jsonXmlElemCount ( jsonObj );
		
		if(elementsCnt > 0) {
			for( var it in jsonObj ) {
				
				if(jsonXmlSpecialElem ( jsonObj, it) )
					continue;			
				
				var subObj = jsonObj[it];						
				
				var attrList = parseJSONAttributes( subObj )
				
				if(subObj!=null && subObj instanceof Object) {
					
					if(subObj instanceof Array) {					
						result+=parseJSONArray( subObj, it, attrList )					
					}
					else {
						result+=startTag(subObj, it, attrList, false);
						result+=parseJSONObject(subObj);
						result+=endTag(subObj,it);
					}
				}
				else {
					result+=startTag(subObj, it, attrList, false);
					result+=parseJSONTextObject(subObj);
					result+=endTag(subObj,it);
				}
			}
		}
		result+=parseJSONTextObject(jsonObj);
		
		return result;
	}
	
	this.parseXmlString = function(xmlDocStr) {
		var xmlDoc;
		if (window.DOMParser) {
			var parser=new window.DOMParser();			
			xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
		}
		else {
			// IE :(
			if(xmlDocStr.indexOf("<?")==0) {
				xmlDocStr = xmlDocStr.substr( xmlDocStr.indexOf("?>") + 2 );
			}
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async="false";
			xmlDoc.loadXML(xmlDocStr);
		}
		return xmlDoc;
	}

	this.xml2json = function (xmlDoc) {
		return parseDOMChildren ( xmlDoc );
	}
	
	this.xml_str2json = function (xmlDocStr) {
		var xmlDoc = this.parseXmlString(xmlDocStr);	
		return this.xml2json(xmlDoc);
	}

	this.json2xml_str = function (jsonObj) {
		return parseJSONObject ( jsonObj );
	}

	this.json2xml = function (jsonObj) {
		var xmlDocStr = this.json2xml_str (jsonObj);
		return this.parseXmlString(xmlDocStr);
	}
}

//    http://code.google.com/p/x2js/

//*****************    Usage samples   *********************

//var X2JS = new X2JS();
//
//// JSON to DOM
//var xmlDoc = X2JS.json2xml(
//    {
//        MyRoot : {
//            MyChild : 'my_child_value',
//            MyAnotherChild: 10,
//            MyArray : [ 'test', 'test2' ],
//            MyArrayRecords : [
//                {
//                    ttt : 'vvvv'
//                },
//                {
//                    ttt : 'vvvv2'
//                }
//            ]
//        }
//    }
//);
//
//
//// JSON to XML string
//var xmlDocStr = X2JS.json2xml_str(
//    {
//        MyRoot : {
//            MyChild : 'my_child_value',
//            MyAnotherChild : 10,
//            MyArray : [ 'test', 'test2' ],
//            MyArrayRecords : [
//                {
//                    ttt : 'vvvv'
//                },
//                {
//                    ttt : 'vvvv2'
//                }
//            ]
//        }
//    }
//);
//
//alert(xmlDocStr);
//
//// XML string to JSON
//var xmlText = "<MyOperation><test>Success</test><test2><item>ddsfg</item><item>dsdgfdgfd</item></test2></MyOperation>";
//var jsonObj = X2JS.xml_str2json( xmlText );
//alert (jsonObj.MyOperation.test);
//alert (jsonObj.MyOperation.test_asArray[0]);
//
//// XML/DOM to JSON
//var xmlText = " <MyOperation> <test>- Success -</test> <test2> <item> ddsfg </item> <item>dsdgfdgfd</item></test2></MyOperation>"
//xmlDoc=X2JS.parseXmlString(xmlText);
//
//var jsonObj = X2JS.xml2json( xmlDoc );
//alert (jsonObj.MyOperation.test);
//
//// Parsing XML attrs
//var xmlText = "<MyOperation myAttr='SuccessAttrValue'><txtAttrChild sAttr='SUCCESS TXT ATTR CHILD'>SUCCESS TXT</txtAttrChild><test>Success</test><test2 myAttr='SuccessAttrValueTest2'><item>ddsfg</item><item>dsdgfdgfd</item></test2></MyOperation>";
//var jsonObj = X2JS.xml_str2json( xmlText );
//alert (jsonObj.MyOperation._myAttr);
//alert (jsonObj.MyOperation.test2._myAttr);
//alert (jsonObj.MyOperation.txtAttrChild._sAttr);
//alert (jsonObj.MyOperation.txtAttrChild.__text);
//alert (jsonObj.MyOperation.txtAttrChild);
//
//// JSON to XML attrs
//var xmlDocStr = X2JS.json2xml_str(
//    {
//        TestAttrRoot : {
//            _myAttr : 'myAttrValue',
//            MyChild : 'my_child_value',
//            MyAnotherChild: 10,
//            MyTextAttrChild : {
//                _myTextAttr : 'myTextAttrValue',
//                __text : 'HelloText'
//            }
//        }
//    }
//);
//
//alert(xmlDocStr);
//
//
//// Parse XML with namespaces
//var xmlText = "<testns:MyOperation xmlns:testns='http://www.example.org'><test>Success</test><test2 myAttr='SuccessAttrValueTest2'><item>ddsfg</item><item>dsdgfdgfd</item></test2></testns:MyOperation>";
//var jsonObj = X2JS.xml_str2json( xmlText );
//alert(jsonObj.MyOperation.test);
//
//var testObjC = {
//    'm:TestAttrRoot' : {
//        '_tns:m' : 'http://www.example.org',
//        '_tns:cms' : 'http://www.example.org',
//        MyChild : 'my_child_value',
//        'cms:MyAnotherChild' : 'vdfd'
//    }
//}
//
//// Parse JSON object with namespaces
//var xmlDocStr = X2JS.json2xml_str(
//    testObjC
//);
//
//alert(xmlDocStr);
//
//// Parse JSON object constructed with another NS-style
//var testObjNew = {
//    TestAttrRoot : {
//        __prefix : 'm',
//        '_tns:m' : 'http://www.example.org',
//        '_tns:cms' : 'http://www.example.org',
//        MyChild : 'my_child_value',
//        MyAnotherChild : {
//            __prefix : 'cms',
//            __text : 'vdfd'
//        }
//    }
//}
//
//// Parse JSON object with namespaces
//var xmlDocStr = X2JS.json2xml_str(
//    testObjNew
//);
//
//alert(xmlDocStr);
//
//// Parse XML with header
//var xmlText = "<?xml version='1.0' encoding='utf-8' ?>\n"+
//    "<test>XML HEADER SUCCESS!</test>";
//
//var jsonObj = X2JS.xml_str2json( xmlText );
//alert(jsonObj.test);
//
//// Parse XML with CDATA
//var xmlText = "<test><simple>simple success</simple><data><![CDATA[<success/>]]></data> </test>";
//
//var jsonObj = X2JS.xml_str2json( xmlText );
//alert(jsonObj.test.data);
//alert(jsonObj.test.data.__cdata);
//alert(jsonObj.test.simple);
//
//
//// Parse JSON object with CDATA
//var xmlDocStr = X2JS.json2xml_str(
//    jsonObj
//);
//alert(xmlDocStr);