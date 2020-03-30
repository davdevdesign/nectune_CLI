import Command from '@oclif/command'
require('dotenv').config()
var blessed = require('blessed');

export class MyCommand extends Command {

  async run() {

    //INIT AIRTABLE
    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appcKg4FJ08P9Ygxa');


    //PAGINATION FUNCTION
    function paginate(array, page_size, page_number) {

      var sliceIt = array.slice((page_number - 1) * page_size, page_number * page_size);

      return sliceIt;
    }

    //BLESSED LAYOUT
    // Create a screen object.
    var screen = blessed.screen({
      smartCSR: true
    });

    screen.title = 'Nectune homepage';

    var mainHome = blessed.box({
      top: '0%',
      left: 'center',
      width: '60%',
      height: '100%',
      scrollable: true,
      keys: true,
      alwaysScroll: true,
      scrollbar: {
        bg: 'blue'
      },
    });

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });
    


    screen.append(mainHome);
    

    //START AIRTABLE LOOP
    base('Yoworld').select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {

      fetchNextPage();

        //MAP RECORD
        var ids = records.map(function(i) {
          return{
            content: i.get('content'),
            col: i.get('col'),
            row: i.get('row'),
            left: i.get('left')
          } 
        });
      

        //PAGINATE SORT RECORD
        var listCards = paginate(ids, 100, 1)
        

        //LOOP RECORD
        var i = 0;
        var toTop = 0;
        var colSize = 35;

        while (i < listCards.length) {

          if(listCards[i].row == 0){
            var toTop = toTop;
          } 
          else{
            var toTop = toTop + colSize;
          }

          //CARD
          var boxTwo = blessed.box({
            parent: mainHome,
            top: toTop + '%',
            left: listCards[i].left + '%',
            width: listCards[i].col + '%',
            height: '33%',
            content: listCards[i].content,
            align: 'center',
            valign: 'middle',
            style: {
              fg: '#000',
              bg: '#efefef',
            }
          });
        
        //LOOP RECORD END
        i++;
          
        }

      // Render the screen.
      screen.render();
              
      
    //END AIRTABLE LOOP
    }, function done(err) {
        if (err) { console.error(err); return; }
    });


  }
}
