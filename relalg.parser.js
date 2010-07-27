/*
	Default driver template for JS/CC generated parsers for Mozilla/Spidermonkey
	
	WARNING: Do not use for parsers that should run as browser-based JavaScript!
			 Use driver_web.js_ instead!
	
	Features:
	- Parser trace messages
	- Integrated panic-mode error recovery
	- Pseudo-graphical parse tree generation
	
	Written 2007, 2008 by Jan Max Meyer, J.M.K S.F. Software Technologies
	
	This is in the public domain.
*/


var _dbg_withparsetree	= false;
var _dbg_withtrace		= false;

function __dbg_print( text )
{
	print( text );
}

function __lex( info )
{
	var state		= 0;
	var match		= -1;
	var match_pos	= 0;
	var start		= 0;
	var pos			= info.offset + 1;

	do
	{
		pos--;
		state = 0;
		match = -2;
		start = pos;

		if( info.src.length <= start )
			return 29;

		do
		{

switch( state )
{
	case 0:
		if( ( info.src.charCodeAt( pos ) >= 9 && info.src.charCodeAt( pos ) <= 10 ) || info.src.charCodeAt( pos ) == 13 || info.src.charCodeAt( pos ) == 32 ) state = 1;
		else if( info.src.charCodeAt( pos ) == 40 ) state = 2;
		else if( info.src.charCodeAt( pos ) == 41 ) state = 3;
		else if( info.src.charCodeAt( pos ) == 44 ) state = 4;
		else if( info.src.charCodeAt( pos ) == 45 ) state = 5;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 6;
		else if( info.src.charCodeAt( pos ) == 60 || info.src.charCodeAt( pos ) == 62 ) state = 7;
		else if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 72 ) || ( info.src.charCodeAt( pos ) >= 75 && info.src.charCodeAt( pos ) <= 79 ) || info.src.charCodeAt( pos ) == 81 || info.src.charCodeAt( pos ) == 84 || ( info.src.charCodeAt( pos ) >= 86 && info.src.charCodeAt( pos ) <= 87 ) || ( info.src.charCodeAt( pos ) >= 89 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 88 ) state = 9;
		else if( info.src.charCodeAt( pos ) == 91 ) state = 10;
		else if( info.src.charCodeAt( pos ) == 93 ) state = 11;
		else if( info.src.charCodeAt( pos ) == 33 || info.src.charCodeAt( pos ) == 61 ) state = 23;
		else if( info.src.charCodeAt( pos ) == 38 ) state = 26;
		else if( info.src.charCodeAt( pos ) == 39 ) state = 28;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 30;
		else if( info.src.charCodeAt( pos ) == 124 ) state = 32;
		else if( info.src.charCodeAt( pos ) == 74 ) state = 41;
		else if( info.src.charCodeAt( pos ) == 85 ) state = 47;
		else if( info.src.charCodeAt( pos ) == 82 ) state = 52;
		else if( info.src.charCodeAt( pos ) == 83 ) state = 53;
		else if( info.src.charCodeAt( pos ) == 80 ) state = 56;
		else if( info.src.charCodeAt( pos ) == 73 ) state = 59;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 15;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 16;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 5:
		if( info.src.charCodeAt( pos ) == 62 ) state = 14;
		else state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 6:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 6;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 15;
		else state = -1;
		match = 21;
		match_pos = pos;
		break;

	case 7:
		if( info.src.charCodeAt( pos ) == 61 ) state = 24;
		else state = -1;
		match = 14;
		match_pos = pos;
		break;

	case 8:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 9:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 10:
		state = -1;
		match = 17;
		match_pos = pos;
		break;

	case 11:
		state = -1;
		match = 18;
		match_pos = pos;
		break;

	case 12:
		state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 13:
		if( info.src.charCodeAt( pos ) == 39 ) state = 28;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 14:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 15:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 15;
		else state = -1;
		match = 22;
		match_pos = pos;
		break;

	case 16:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 17:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 18:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 19:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 20:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 21:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 22:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 23:
		if( info.src.charCodeAt( pos ) == 61 ) state = 24;
		else state = -1;
		break;

	case 24:
		state = -1;
		match = 14;
		match_pos = pos;
		break;

	case 25:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 17;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 26:
		if( info.src.charCodeAt( pos ) == 38 ) state = 12;
		else state = -1;
		break;

	case 27:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 18;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 28:
		if( info.src.charCodeAt( pos ) == 39 ) state = 13;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 38 ) || ( info.src.charCodeAt( pos ) >= 40 && info.src.charCodeAt( pos ) <= 254 ) ) state = 28;
		else state = -1;
		break;

	case 29:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 19;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 30:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 15;
		else state = -1;
		break;

	case 31:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 20;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 32:
		if( info.src.charCodeAt( pos ) == 124 ) state = 16;
		else state = -1;
		break;

	case 33:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 21;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 34:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 22;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 35:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 105 ) state = 25;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 36:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 111 ) state = 27;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 37:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 108 ) || ( info.src.charCodeAt( pos ) >= 110 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 109 ) state = 29;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 38:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 99 ) state = 31;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 39:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 99 ) state = 33;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 40:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 99 ) state = 34;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 41:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 111 ) state = 35;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 42:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 105 ) state = 36;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 43:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 97 ) state = 37;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 44:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 38;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 45:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 39;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 46:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 40;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 47:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 42;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 48:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 43;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 49:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 107 ) || ( info.src.charCodeAt( pos ) >= 109 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 108 ) state = 44;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 50:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 105 ) || ( info.src.charCodeAt( pos ) >= 107 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 106 ) state = 45;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 51:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 115 ) state = 46;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 52:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 48;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 53:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 49;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 54:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 111 ) state = 50;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 55:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 114 ) state = 51;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 56:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 114 ) state = 54;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 57:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 55;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 58:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 57;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 59:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 8;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 58;
		else state = -1;
		match = 19;
		match_pos = pos;
		break;

}


			pos++;

		}
		while( state > -1 );

	}
	while( 1 > -1 && match == 1 );

	if( match > -1 )
	{
		info.att = info.src.substr( start, match_pos - start );
		info.offset = match_pos;
		
switch( match )
{
	case 20:
		{
		 info.att = info.att.substr( 1, info.att.length - 2 );
																   	   info.att = info.att.replace( /''/g, "\'" );		
		}
		break;

	case 21:
		{
		 info.att = parseInt(info.att); 
		}
		break;

	case 22:
		{
		 info.att = parseFloat(info.att); 
		}
		break;

}


	}
	else
	{
		info.att = new String();
		match = -1;
	}

	return match;
}


function __parse( src, err_off, err_la )
{
	var		sstack			= new Array();
	var		vstack			= new Array();
	var 	err_cnt			= 0;
	var		act;
	var		go;
	var		la;
	var		rval;
	var 	parseinfo		= new Function( "", "var offset; var src; var att;" );
	var		info			= new parseinfo();
	
	//Visual parse tree generation
	var 	treenode		= new Function( "", "var sym; var att; var child;" );
	var		treenodes		= new Array();
	var		tree			= new Array();
	var		tmptree			= null;

/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* Algebra' */, 1 ),
	new Array( 24/* Algebra */, 1 ),
	new Array( 23/* Stmt */, 1 ),
	new Array( 23/* Stmt */, 3 ),
	new Array( 23/* Stmt */, 3 ),
	new Array( 23/* Stmt */, 3 ),
	new Array( 23/* Stmt */, 3 ),
	new Array( 23/* Stmt */, 6 ),
	new Array( 23/* Stmt */, 3 ),
	new Array( 23/* Stmt */, 3 ),
	new Array( 23/* Stmt */, 7 ),
	new Array( 23/* Stmt */, 7 ),
	new Array( 23/* Stmt */, 7 ),
	new Array( 26/* ProjectionList */, 1 ),
	new Array( 26/* ProjectionList */, 3 ),
	new Array( 27/* RenameList */, 3 ),
	new Array( 27/* RenameList */, 3 ),
	new Array( 27/* RenameList */, 5 ),
	new Array( 27/* RenameList */, 5 ),
	new Array( 25/* Criteria */, 3 ),
	new Array( 25/* Criteria */, 3 ),
	new Array( 25/* Criteria */, 3 ),
	new Array( 25/* Criteria */, 3 ),
	new Array( 28/* Value */, 1 ),
	new Array( 28/* Value */, 1 ),
	new Array( 28/* Value */, 1 ),
	new Array( 28/* Value */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 1 */ new Array( 29/* "$" */,0 ),
	/* State 2 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 29/* "$" */,-1 ),
	/* State 3 */ new Array( 29/* "$" */,-2 , 7/* "Union" */,-2 , 8/* "Intersect" */,-2 , 9/* "-" */,-2 , 10/* "X" */,-2 , 11/* "Join" */,-2 , 16/* ")" */,-2 ),
	/* State 4 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 5 */ new Array( 17/* "[" */,14 ),
	/* State 6 */ new Array( 17/* "[" */,15 ),
	/* State 7 */ new Array( 17/* "[" */,16 ),
	/* State 8 */ new Array( 17/* "[" */,17 , 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 9 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 10 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 11 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 12 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 13 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 16/* ")" */,23 ),
	/* State 14 */ new Array( 19/* "Identifier" */,25 ),
	/* State 15 */ new Array( 19/* "Identifier" */,27 , 21/* "Integer" */,28 ),
	/* State 16 */ new Array( 15/* "(" */,31 , 19/* "Identifier" */,32 , 20/* "String" */,33 , 21/* "Integer" */,34 , 22/* "Float" */,35 ),
	/* State 17 */ new Array( 15/* "(" */,31 , 19/* "Identifier" */,32 , 20/* "String" */,33 , 21/* "Integer" */,34 , 22/* "Float" */,35 ),
	/* State 18 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 29/* "$" */,-8 , 16/* ")" */,-8 ),
	/* State 19 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 29/* "$" */,-6 , 16/* ")" */,-6 ),
	/* State 20 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 29/* "$" */,-5 , 16/* ")" */,-5 ),
	/* State 21 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 29/* "$" */,-4 , 16/* ")" */,-4 ),
	/* State 22 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 29/* "$" */,-3 , 16/* ")" */,-3 ),
	/* State 23 */ new Array( 29/* "$" */,-9 , 7/* "Union" */,-9 , 8/* "Intersect" */,-9 , 9/* "-" */,-9 , 10/* "X" */,-9 , 11/* "Join" */,-9 , 16/* ")" */,-9 ),
	/* State 24 */ new Array( 13/* "," */,37 , 18/* "]" */,38 ),
	/* State 25 */ new Array( 18/* "]" */,-13 , 13/* "," */,-13 ),
	/* State 26 */ new Array( 13/* "," */,39 , 18/* "]" */,40 ),
	/* State 27 */ new Array( 12/* "->" */,41 ),
	/* State 28 */ new Array( 12/* "->" */,42 ),
	/* State 29 */ new Array( 2/* "||" */,43 , 3/* "&&" */,44 , 18/* "]" */,45 ),
	/* State 30 */ new Array( 14/* "Comparison" */,46 ),
	/* State 31 */ new Array( 15/* "(" */,31 , 19/* "Identifier" */,32 , 20/* "String" */,33 , 21/* "Integer" */,34 , 22/* "Float" */,35 ),
	/* State 32 */ new Array( 14/* "Comparison" */,-23 , 18/* "]" */,-23 , 3/* "&&" */,-23 , 2/* "||" */,-23 , 16/* ")" */,-23 ),
	/* State 33 */ new Array( 14/* "Comparison" */,-24 , 18/* "]" */,-24 , 3/* "&&" */,-24 , 2/* "||" */,-24 , 16/* ")" */,-24 ),
	/* State 34 */ new Array( 14/* "Comparison" */,-25 , 18/* "]" */,-25 , 3/* "&&" */,-25 , 2/* "||" */,-25 , 16/* ")" */,-25 ),
	/* State 35 */ new Array( 14/* "Comparison" */,-26 , 18/* "]" */,-26 , 3/* "&&" */,-26 , 2/* "||" */,-26 , 16/* ")" */,-26 ),
	/* State 36 */ new Array( 2/* "||" */,43 , 3/* "&&" */,44 , 18/* "]" */,48 ),
	/* State 37 */ new Array( 19/* "Identifier" */,49 ),
	/* State 38 */ new Array( 15/* "(" */,50 ),
	/* State 39 */ new Array( 19/* "Identifier" */,51 , 21/* "Integer" */,52 ),
	/* State 40 */ new Array( 15/* "(" */,53 ),
	/* State 41 */ new Array( 19/* "Identifier" */,54 ),
	/* State 42 */ new Array( 19/* "Identifier" */,55 ),
	/* State 43 */ new Array( 15/* "(" */,31 , 19/* "Identifier" */,32 , 20/* "String" */,33 , 21/* "Integer" */,34 , 22/* "Float" */,35 ),
	/* State 44 */ new Array( 15/* "(" */,31 , 19/* "Identifier" */,32 , 20/* "String" */,33 , 21/* "Integer" */,34 , 22/* "Float" */,35 ),
	/* State 45 */ new Array( 15/* "(" */,58 ),
	/* State 46 */ new Array( 19/* "Identifier" */,32 , 20/* "String" */,33 , 21/* "Integer" */,34 , 22/* "Float" */,35 ),
	/* State 47 */ new Array( 2/* "||" */,43 , 3/* "&&" */,44 , 16/* ")" */,60 ),
	/* State 48 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 49 */ new Array( 18/* "]" */,-14 , 13/* "," */,-14 ),
	/* State 50 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 51 */ new Array( 12/* "->" */,63 ),
	/* State 52 */ new Array( 12/* "->" */,64 ),
	/* State 53 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 54 */ new Array( 18/* "]" */,-15 , 13/* "," */,-15 ),
	/* State 55 */ new Array( 18/* "]" */,-16 , 13/* "," */,-16 ),
	/* State 56 */ new Array( 2/* "||" */,-21 , 3/* "&&" */,44 , 18/* "]" */,-21 , 16/* ")" */,-21 ),
	/* State 57 */ new Array( 2/* "||" */,-20 , 3/* "&&" */,-20 , 18/* "]" */,-20 , 16/* ")" */,-20 ),
	/* State 58 */ new Array( 19/* "Identifier" */,3 , 15/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 59 */ new Array( 18/* "]" */,-19 , 3/* "&&" */,-19 , 2/* "||" */,-19 , 16/* ")" */,-19 ),
	/* State 60 */ new Array( 18/* "]" */,-22 , 3/* "&&" */,-22 , 2/* "||" */,-22 , 16/* ")" */,-22 ),
	/* State 61 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 29/* "$" */,-7 , 16/* ")" */,-7 ),
	/* State 62 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 16/* ")" */,67 ),
	/* State 63 */ new Array( 19/* "Identifier" */,68 ),
	/* State 64 */ new Array( 19/* "Identifier" */,69 ),
	/* State 65 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 16/* ")" */,70 ),
	/* State 66 */ new Array( 11/* "Join" */,8 , 10/* "X" */,9 , 9/* "-" */,10 , 8/* "Intersect" */,11 , 7/* "Union" */,12 , 16/* ")" */,71 ),
	/* State 67 */ new Array( 29/* "$" */,-10 , 7/* "Union" */,-10 , 8/* "Intersect" */,-10 , 9/* "-" */,-10 , 10/* "X" */,-10 , 11/* "Join" */,-10 , 16/* ")" */,-10 ),
	/* State 68 */ new Array( 18/* "]" */,-17 , 13/* "," */,-17 ),
	/* State 69 */ new Array( 18/* "]" */,-18 , 13/* "," */,-18 ),
	/* State 70 */ new Array( 29/* "$" */,-11 , 7/* "Union" */,-11 , 8/* "Intersect" */,-11 , 9/* "-" */,-11 , 10/* "X" */,-11 , 11/* "Join" */,-11 , 16/* ")" */,-11 ),
	/* State 71 */ new Array( 29/* "$" */,-12 , 7/* "Union" */,-12 , 8/* "Intersect" */,-12 , 9/* "-" */,-12 , 10/* "X" */,-12 , 11/* "Join" */,-12 , 16/* ")" */,-12 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 24/* Algebra */,1 , 23/* Stmt */,2 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array(  ),
	/* State 3 */ new Array(  ),
	/* State 4 */ new Array( 23/* Stmt */,13 ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array(  ),
	/* State 7 */ new Array(  ),
	/* State 8 */ new Array( 23/* Stmt */,18 ),
	/* State 9 */ new Array( 23/* Stmt */,19 ),
	/* State 10 */ new Array( 23/* Stmt */,20 ),
	/* State 11 */ new Array( 23/* Stmt */,21 ),
	/* State 12 */ new Array( 23/* Stmt */,22 ),
	/* State 13 */ new Array(  ),
	/* State 14 */ new Array( 26/* ProjectionList */,24 ),
	/* State 15 */ new Array( 27/* RenameList */,26 ),
	/* State 16 */ new Array( 25/* Criteria */,29 , 28/* Value */,30 ),
	/* State 17 */ new Array( 25/* Criteria */,36 , 28/* Value */,30 ),
	/* State 18 */ new Array(  ),
	/* State 19 */ new Array(  ),
	/* State 20 */ new Array(  ),
	/* State 21 */ new Array(  ),
	/* State 22 */ new Array(  ),
	/* State 23 */ new Array(  ),
	/* State 24 */ new Array(  ),
	/* State 25 */ new Array(  ),
	/* State 26 */ new Array(  ),
	/* State 27 */ new Array(  ),
	/* State 28 */ new Array(  ),
	/* State 29 */ new Array(  ),
	/* State 30 */ new Array(  ),
	/* State 31 */ new Array( 25/* Criteria */,47 , 28/* Value */,30 ),
	/* State 32 */ new Array(  ),
	/* State 33 */ new Array(  ),
	/* State 34 */ new Array(  ),
	/* State 35 */ new Array(  ),
	/* State 36 */ new Array(  ),
	/* State 37 */ new Array(  ),
	/* State 38 */ new Array(  ),
	/* State 39 */ new Array(  ),
	/* State 40 */ new Array(  ),
	/* State 41 */ new Array(  ),
	/* State 42 */ new Array(  ),
	/* State 43 */ new Array( 25/* Criteria */,56 , 28/* Value */,30 ),
	/* State 44 */ new Array( 25/* Criteria */,57 , 28/* Value */,30 ),
	/* State 45 */ new Array(  ),
	/* State 46 */ new Array( 28/* Value */,59 ),
	/* State 47 */ new Array(  ),
	/* State 48 */ new Array( 23/* Stmt */,61 ),
	/* State 49 */ new Array(  ),
	/* State 50 */ new Array( 23/* Stmt */,62 ),
	/* State 51 */ new Array(  ),
	/* State 52 */ new Array(  ),
	/* State 53 */ new Array( 23/* Stmt */,65 ),
	/* State 54 */ new Array(  ),
	/* State 55 */ new Array(  ),
	/* State 56 */ new Array(  ),
	/* State 57 */ new Array(  ),
	/* State 58 */ new Array( 23/* Stmt */,66 ),
	/* State 59 */ new Array(  ),
	/* State 60 */ new Array(  ),
	/* State 61 */ new Array(  ),
	/* State 62 */ new Array(  ),
	/* State 63 */ new Array(  ),
	/* State 64 */ new Array(  ),
	/* State 65 */ new Array(  ),
	/* State 66 */ new Array(  ),
	/* State 67 */ new Array(  ),
	/* State 68 */ new Array(  ),
	/* State 69 */ new Array(  ),
	/* State 70 */ new Array(  ),
	/* State 71 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"Algebra'" /* Non-terminal symbol */,
	"WHITESPACE" /* Terminal symbol */,
	"||" /* Terminal symbol */,
	"&&" /* Terminal symbol */,
	"Project" /* Terminal symbol */,
	"Rename" /* Terminal symbol */,
	"Select" /* Terminal symbol */,
	"Union" /* Terminal symbol */,
	"Intersect" /* Terminal symbol */,
	"-" /* Terminal symbol */,
	"X" /* Terminal symbol */,
	"Join" /* Terminal symbol */,
	"->" /* Terminal symbol */,
	"," /* Terminal symbol */,
	"Comparison" /* Terminal symbol */,
	"(" /* Terminal symbol */,
	")" /* Terminal symbol */,
	"[" /* Terminal symbol */,
	"]" /* Terminal symbol */,
	"Identifier" /* Terminal symbol */,
	"String" /* Terminal symbol */,
	"Integer" /* Terminal symbol */,
	"Float" /* Terminal symbol */,
	"Stmt" /* Non-terminal symbol */,
	"Algebra" /* Non-terminal symbol */,
	"Criteria" /* Non-terminal symbol */,
	"ProjectionList" /* Non-terminal symbol */,
	"RenameList" /* Non-terminal symbol */,
	"Value" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


	
	info.offset = 0;
	info.src = src;
	info.att = new String();
	
	if( !err_off )
		err_off	= new Array();
	if( !err_la )
	err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	la = __lex( info );
			
	while( true )
	{
		act = 73;
		for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
		{
			if( act_tab[sstack[sstack.length-1]][i] == la )
			{
				act = act_tab[sstack[sstack.length-1]][i+1];
				break;
			}
		}

		/*
		_print( "state " + sstack[sstack.length-1] + " la = " + la + " info.att = >" +
				info.att + "< act = " + act + " src = >" + info.src.substr( info.offset, 30 ) + "..." + "<" +
					" sstack = " + sstack.join() );
		*/
		
		if( _dbg_withtrace && sstack.length > 0 )
		{
			__dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
							"\tAction: " + act + "\n" + 
							"\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
									"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
		}
		
			
		//Panic-mode: Try recovery when parse-error occurs!
		if( act == 73 )
		{
			if( _dbg_withtrace )
				__dbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
			
			err_cnt++;
			err_off.push( info.offset - info.att.length );			
			err_la.push( new Array() );
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
				err_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );
			
			//Remember the original stack!
			var rsstack = new Array();
			var rvstack = new Array();
			for( var i = 0; i < sstack.length; i++ )
			{
				rsstack[i] = sstack[i];
				rvstack[i] = vstack[i];
			}
			
			while( act == 73 && la != 29 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery\n" +
									"Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
									"Action: " + act + "\n\n" );
				if( la == -1 )
					info.offset++;
					
				while( act == 73 && sstack.length > 0 )
				{
					sstack.pop();
					vstack.pop();
					
					if( sstack.length == 0 )
						break;
						
					act = 73;
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == la )
						{
							act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
				}
				
				if( act != 73 )
					break;
				
				for( var i = 0; i < rsstack.length; i++ )
				{
					sstack.push( rsstack[i] );
					vstack.push( rvstack[i] );
				}
				
				la = __lex( info );
			}
			
			if( act == 73 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery failed, terminating parse process..." );
				break;
			}


			if( _dbg_withtrace )
				__dbg_print( "\tError recovery succeeded, continuing" );
		}
		
		/*
		if( act == 73 )
			break;
		*/
		
		
		//Shift
		if( act > 0 )
		{
			//Parse tree generation
			if( _dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ la ];
				node.att = info.att;
				node.child = new Array();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( _dbg_withtrace )
				__dbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
		
			sstack.push( act );
			vstack.push( info.att );
			
			la = __lex( info );
			
			if( _dbg_withtrace )
				__dbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
		}
		//Reduce
		else
		{		
			act *= -1;
			
			if( _dbg_withtrace )
				__dbg_print( "Reducing by producution: " + act );
			
			rval = void(0);
			
			if( _dbg_withtrace )
				__dbg_print( "\tPerforming semantic action..." );
			
switch( act )
{
	case 0:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 1:
	{
		 algebra = vstack[ vstack.length - 1 ]; 
	}
	break;
	case 2:
	{
		 rval = new Tree.Relation( vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 3:
	{
		 rval = new Tree.Union( vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 4:
	{
		 rval = new Tree.Intersection( vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 5:
	{
		 rval = new Tree.Difference( vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 6:
	{
		 rval = new Tree.Cartesian( vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 7:
	{
		 rval = new Tree.Join( vstack[ vstack.length - 6 ], vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 8:
	{
		 rval = new Tree.NaturalJoin( vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 9:
	{
		 rval = vstack[ vstack.length - 2 ] 
	}
	break;
	case 10:
	{
		 rval = new Tree.Projection( vstack[ vstack.length - 5 ], vstack[ vstack.length - 2 ] ); 
	}
	break;
	case 11:
	{
		 rval = new Tree.Rename( vstack[ vstack.length - 5 ], vstack[ vstack.length - 2 ] ); 
	}
	break;
	case 12:
	{
		 rval = new Tree.Selection( vstack[ vstack.length - 5 ], vstack[ vstack.length - 2 ] ); 
	}
	break;
	case 13:
	{
		 rval = new Tree.ProjectionList( vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 14:
	{
		 rval = vstack[ vstack.length - 3 ].add(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 15:
	{
		 rval = new Tree.RenameList( [vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]] ); 
	}
	break;
	case 16:
	{
		 rval = new Tree.RenameList( [vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]] ); 
	}
	break;
	case 17:
	{
		 rval = vstack[ vstack.length - 5 ].add( [vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]] ); 
	}
	break;
	case 18:
	{
		 rval = vstack[ vstack.length - 5 ].add( [vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]] ); 
	}
	break;
	case 19:
	{
		 rval = new Tree.Criteria(vstack[ vstack.length - 3 ], vstack[ vstack.length - 2 ], vstack[ vstack.length - 1 ]); 
	}
	break;
	case 20:
	{
		 rval = new Tree.CriteriaComposition(vstack[ vstack.length - 3 ], 'AND', vstack[ vstack.length - 1 ]); 
	}
	break;
	case 21:
	{
		 rval = new Tree.CriteriaComposition(vstack[ vstack.length - 3 ], 'OR', vstack[ vstack.length - 1 ]); 
	}
	break;
	case 22:
	{
		 rval = vstack[ vstack.length - 2 ]; 
	}
	break;
	case 23:
	{
		 rval = new Tree.Attribute( vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 24:
	{
		 rval = new Tree.Value( vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 25:
	{
		 rval = new Tree.Value( vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 26:
	{
		 rval = new Tree.Value( vstack[ vstack.length - 1 ] ); 
	}
	break;
}


			
			if( _dbg_withparsetree )
				tmptree = new Array();

			if( _dbg_withtrace )
				__dbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{
				if( _dbg_withparsetree )
					tmptree.push( tree.pop() );
					
				sstack.pop();
				vstack.pop();
			}
									
			go = -1;
			for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
			{
				if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
				{
					go = goto_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
			
			if( _dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ pop_tab[act][0] ];
				node.att = new String();
				node.child = tmptree.reverse();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( act == 0 )
				break;
				
			if( _dbg_withtrace )
				__dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
				
			sstack.push( go );
			vstack.push( rval );			
		}
	}

	if( _dbg_withtrace )
		__dbg_print( "\nParse complete." );

	if( _dbg_withparsetree )
	{
		if( err_cnt == 0 )
		{
			__dbg_print( "\n\n--- Parse tree ---" );
			__dbg_parsetree( 0, treenodes, tree );
		}
		else
		{
			__dbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
		}
	}
	
	return err_cnt;
}


function __dbg_parsetree( indent, nodes, tree )
{
	var str = new String();
	for( var i = 0; i < tree.length; i++ )
	{
		str = "";
		for( var j = indent; j > 0; j-- )
			str += "\t";
		
		str += nodes[ tree[i] ].sym;
		if( nodes[ tree[i] ].att != "" )
			str += " >" + nodes[ tree[i] ].att + "<" ;
			
		__dbg_print( str );
		if( nodes[ tree[i] ].child.length > 0 )
			__dbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
	}
}


var error_offsets = new Array();
var error_lookaheads = new Array();
var error_count = 0;

function parser( input ) {
	algebra = null;
	
	error_count = __parse( input, error_offsets, error_lookaheads );
	if( error_count > 0 ) {
		var error = '';
		for( var i = 0; i < error_count; i++ )
			error += "Parse error near '" 	+ str.substr( error_offsets[i] ) +	"', expecting '" + error_lookaheads[i].join() + "'\n";
		throw error;
  	}
  
	return algebra;
}


