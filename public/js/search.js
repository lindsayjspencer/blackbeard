export default function Search(term, toSearch) {
    this.term = term.toLowerCase();
    this.words = term.split(' ');
    this.trimmed = term.replace(" ", "").trim().replace(/\-|\+|\./g, "");
    this.results = {
        error: false,
        matches: []
    };
    this.go = function() {
        if (term.length == 0) {
            this.results.error = 'No content';
            return this.results;
        }
        if (term.length < 3) {
            this.results.error = "Too short";
            return this.results;
        } else {
            // compare slices
            // mc is a master container for matches. Any potential match that recieves a hit somewhere gets its own
            // container. After all comparisons they will be ranked and those with few hits are weeded out.
            // There are 3 methods to compare slices. By slice of 2 characters, 3 characters, and exact word match.
            // Slices are validated to be
            var mc = [];
            var threes = this.trimmed.replace(/ /g, "").match(/.{1,3}/g);
            var twos = this.trimmed.replace(/ /g, "").match(/.{1,2}/g);
            // console.log(twos)
            threes.forEach(function(slice, index) {
                if (slice.length > 2) {
                    toSearch.forEach((searchItem) => {
                        if (searchItem.term.replace(/ /g, "").includes(slice)) {
                            if (mc[searchItem.id] !== undefined) {
                                mc[searchItem.id].count++;
                            } else {
                                mc[searchItem.id] = {
                                    searchItem: searchItem,
                                    count: 1
                                };
                            }
                        }
                    });
                }
            });
            twos.forEach(function(slice, index) {
                if (slice.length > 1) {
                    toSearch.forEach((searchItem) => {
                        if (searchItem.term.replace(/ /g, "").includes(slice)) {
                            if (mc[searchItem.id] !== undefined) {
                                mc[searchItem.id].count+=0.025;
                            }
                        }
                    });
                }
            });
            this.words.forEach((slice)=>{
                if (slice.length > 0) {
                    var toSearchWords;
                    toSearch.forEach((searchItem) => {
                        toSearchWords = searchItem.term.split(" ");
                        toSearchWords.forEach((word)=>{
                            if(word.toLowerCase()==slice.toLowerCase()) {
                                if (mc[searchItem.id] !== undefined) {
                                    mc[searchItem.id].count+=10;
                                }
                            }
                        })
                    });
                }
            });
            mc.forEach(function(item) {
                item.count = item.count + (item.searchItem.preMultiply/5) + (item.count/8) / item.searchItem.term.length;
            });
            mc = mc.sort(function(a, b) {
                return parseFloat(b.count) - parseFloat(a.count)
            });
            this.results.matches = mc.slice(0, 20);
        }
        return this.results;
    }
}
