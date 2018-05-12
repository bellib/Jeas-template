"use strict"
const http = require('http'); 
const fs = require('fs') ;
const cheerio = require('cheerio') ;
const str = fs.readFileSync('tem.html','utf8');


const vars = {

  name : 'habib' ,
  id : 455 , 
  cats : [  
    { name : 'habib' ,id : 4578, arra : ['firest in loop 1' ,'firest in loop 2' ,'firest in loop 3']  } ,
    { name :  'bellia' ,id : 4578,arra : ['seccond in loop 1' ,'seccond in loop 2' ,'seccond in loop 3'] },
    { name : 'azer' ,id : 87,arra : ['third in loop 1' ,'third in loop 2' ,'third in loop 3'] }
  ],
  users : [{ mail : "hello@dsd.dsd" , links : ["12","45","45"]},{ mail : "sqs@dsd.dsd" , links : ["1s2","4za5","é&"]},{ mail : "ez45@dsd.dsd" , links : ["vcd","zae","rty"]}] , 
  topics : [1,2,3] ,  
  number : '458' , 
  hide : true   
  
}
const templateVars = vars ;


  class template    {
      
    constructor(str,vars){

      this.strTemplate = str.replace(/\r?\n|\r/g,'') ;
      this.strTemplate = this.strTemplate.replace(/\s{2,}/g,' ') ;
      this.strTemplate = this.strTemplate.replace(/>\s?</g,'>\n<') ;
      this.vars = vars ;
      this.$ = cheerio.load(this.strTemplate) ;
    }
    looper(){ 

      this.$('body>for:not(:only-child)').each( (i,it) => {
         
         const forSelector = this.$(it)  ;
         const attr = forSelector.attr() ;
         const item = attr.item ;
         const items = attr.items ;
         const index = attr.index ; 
         const array2Loop = this.vars[items] ;

         const regexer = new RegExp('(\\${\\s?' + item + '\\.?([a-zA-Z0-9]+)?\\s?})','g') ;
         let nn = '' ;
           
          array2Loop.forEach( ( element, i ) => {
            
            nn += forSelector.html().replace(regexer, (arg,s) => { 

                 return this.replacerVars(arg, element); 

              }) 
          }) ;
           
          forSelector.replaceWith(/* check and replace if there id another loop loop*/ this.infor(nn) )
 
      })
    }
    infor(str){

      const $infor = cheerio.load(str) ;
      const selectorInfor = $infor('for') ;
      let newInfo = "" ;
       $infor('for').each((i , itm) => {
         const htmIn = $infor(itm).html() ;
          
         const attrs = itm.attribs ;
         const item = attrs.item ; 
         const items = attrs.items ; 
         const arr = items.split(',') || [] ;
         const regex = new RegExp('\\${\\s?'+ item +'\\s?}','g') ;
         
          arr.forEach( item => {
            
           newInfo += htmIn.replace(regex,item) ;

          }) ;
          $infor(itm) .replaceWith(newInfo)  ;
            newInfo = '' ;
       } )
          
      return $infor.html() ; 

    }
    replacerVars(variable, valuees){

      const varsGlobal = this.vars ;
      let cleanvariable = variable.replace(/\s|}|{|\$/g,'')
     
      /** value string 
       * variable = any , valuees = "test"
       */
      
      if( typeof valuees === 'string') return valuees ;
      if( typeof valuees === 'object') {

        cleanvariable  = cleanvariable.replace(/^(\w+\.)/,'') ;
         
          return valuees[cleanvariable];
      }
      else return valuees ;

    }
    ifTemp(str,vars){

      const ifSelector = this.$('if')  ;
   
      let f = 0 ;
  
      while( f < ifSelector.length ) {
           
        const currentIf = ifSelector[f] ;
        const attrs     = currentIf.attribs  ;
        const VarName   = Object.keys(attrs)[0] ; 
        const VarValue  = attrs[VarName] ;
        const vToCompare = this.replacerVars( VarName, this.vars ) ;
        const valOfV2Compaire = this.initValToCOmpare(VarValue,this.vars) ; 
  
          //console.log( vToCompare === valOfV2Compaire )
  
         if(   vToCompare === valOfV2Compaire ) {
          this.$(currentIf).replaceWith( this.$(currentIf).html() ) ; 
         } else  this.$(currentIf).replaceWith('') ; 
         
         f++ ;
      }
       
      //return $.html() ;  
    }
    initValToCOmpare(v,vrs){
      if(   v === 'true' ){
        return true ;
      }else if(   v === 'false' ){
        return false ;
      } else  return v.replace(/'/g,'');
  }
    render(){

      this.looper() ;
      this.ifTemp() ;

      return this.$.html() ;
    }
  }
   
const ht = new template( str, vars ).render() ;
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end( ht  );
}); 
   
 
proxy.listen(3000);
 