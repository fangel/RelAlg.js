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
			return 30;

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
		else if( info.src.charCodeAt( pos ) == 47 ) state = 6;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 7;
		else if( info.src.charCodeAt( pos ) == 60 || info.src.charCodeAt( pos ) == 62 ) state = 8;
		else if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 72 ) || ( info.src.charCodeAt( pos ) >= 75 && info.src.charCodeAt( pos ) <= 79 ) || info.src.charCodeAt( pos ) == 81 || info.src.charCodeAt( pos ) == 84 || ( info.src.charCodeAt( pos ) >= 86 && info.src.charCodeAt( pos ) <= 87 ) || ( info.src.charCodeAt( pos ) >= 89 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 88 ) state = 10;
		else if( info.src.charCodeAt( pos ) == 91 ) state = 11;
		else if( info.src.charCodeAt( pos ) == 93 ) state = 12;
		else if( info.src.charCodeAt( pos ) == 33 || info.src.charCodeAt( pos ) == 61 ) state = 24;
		else if( info.src.charCodeAt( pos ) == 38 ) state = 27;
		else if( info.src.charCodeAt( pos ) == 39 ) state = 29;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 31;
		else if( info.src.charCodeAt( pos ) == 124 ) state = 33;
		else if( info.src.charCodeAt( pos ) == 74 ) state = 42;
		else if( info.src.charCodeAt( pos ) == 85 ) state = 48;
		else if( info.src.charCodeAt( pos ) == 82 ) state = 53;
		else if( info.src.charCodeAt( pos ) == 83 ) state = 54;
		else if( info.src.charCodeAt( pos ) == 80 ) state = 57;
		else if( info.src.charCodeAt( pos ) == 73 ) state = 60;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 16;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 17;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 14;
		match_pos = pos;
		break;

	case 5:
		if( info.src.charCodeAt( pos ) == 62 ) state = 15;
		else state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 6:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 7:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 7;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 16;
		else state = -1;
		match = 22;
		match_pos = pos;
		break;

	case 8:
		if( info.src.charCodeAt( pos ) == 61 ) state = 25;
		else state = -1;
		match = 15;
		match_pos = pos;
		break;

	case 9:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 10:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 11:
		state = -1;
		match = 18;
		match_pos = pos;
		break;

	case 12:
		state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 13:
		state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 14:
		if( info.src.charCodeAt( pos ) == 39 ) state = 29;
		else state = -1;
		match = 21;
		match_pos = pos;
		break;

	case 15:
		state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 16:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 16;
		else state = -1;
		match = 23;
		match_pos = pos;
		break;

	case 17:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 18:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 19:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 20:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 21:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 22:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 23:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 24:
		if( info.src.charCodeAt( pos ) == 61 ) state = 25;
		else state = -1;
		break;

	case 25:
		state = -1;
		match = 15;
		match_pos = pos;
		break;

	case 26:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 18;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 27:
		if( info.src.charCodeAt( pos ) == 38 ) state = 13;
		else state = -1;
		break;

	case 28:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 19;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 29:
		if( info.src.charCodeAt( pos ) == 39 ) state = 14;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 38 ) || ( info.src.charCodeAt( pos ) >= 40 && info.src.charCodeAt( pos ) <= 254 ) ) state = 29;
		else state = -1;
		break;

	case 30:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 20;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 31:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 16;
		else state = -1;
		break;

	case 32:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 21;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 33:
		if( info.src.charCodeAt( pos ) == 124 ) state = 17;
		else state = -1;
		break;

	case 34:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 22;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 35:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 23;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 36:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 105 ) state = 26;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 37:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 111 ) state = 28;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 38:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 108 ) || ( info.src.charCodeAt( pos ) >= 110 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 109 ) state = 30;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 39:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 99 ) state = 32;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 40:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 99 ) state = 34;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 41:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 98 ) || ( info.src.charCodeAt( pos ) >= 100 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 99 ) state = 35;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 42:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 111 ) state = 36;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 43:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 105 ) state = 37;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 44:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 97 ) state = 38;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 45:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 39;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 46:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 40;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 47:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 41;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 48:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 43;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 49:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 44;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 50:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 107 ) || ( info.src.charCodeAt( pos ) >= 109 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 108 ) state = 45;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 51:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 105 ) || ( info.src.charCodeAt( pos ) >= 107 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 106 ) state = 46;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 52:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 115 ) state = 47;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 53:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 49;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 54:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 50;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 55:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 111 ) state = 51;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 56:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 114 ) state = 52;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 57:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 114 ) state = 55;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 58:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 56;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 59:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 116 ) state = 58;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 60:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 9;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 59;
		else state = -1;
		match = 20;
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
	case 21:
		{
		 info.att = info.att.substr( 1, info.att.length - 2 );
																   	   info.att = info.att.replace( /''/g, "\'" );		
		}
		break;

	case 22:
		{
		 info.att = parseInt(info.att); 
		}
		break;

	case 23:
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
	new Array( 25/* Algebra */, 1 ),
	new Array( 24/* Stmt */, 1 ),
	new Array( 24/* Stmt */, 3 ),
	new Array( 24/* Stmt */, 3 ),
	new Array( 24/* Stmt */, 3 ),
	new Array( 24/* Stmt */, 3 ),
	new Array( 24/* Stmt */, 6 ),
	new Array( 24/* Stmt */, 3 ),
	new Array( 24/* Stmt */, 3 ),
	new Array( 24/* Stmt */, 3 ),
	new Array( 24/* Stmt */, 7 ),
	new Array( 24/* Stmt */, 7 ),
	new Array( 24/* Stmt */, 7 ),
	new Array( 27/* ProjectionList */, 1 ),
	new Array( 27/* ProjectionList */, 3 ),
	new Array( 28/* RenameList */, 3 ),
	new Array( 28/* RenameList */, 3 ),
	new Array( 28/* RenameList */, 5 ),
	new Array( 28/* RenameList */, 5 ),
	new Array( 26/* Criteria */, 3 ),
	new Array( 26/* Criteria */, 3 ),
	new Array( 26/* Criteria */, 3 ),
	new Array( 26/* Criteria */, 3 ),
	new Array( 29/* Value */, 1 ),
	new Array( 29/* Value */, 1 ),
	new Array( 29/* Value */, 1 ),
	new Array( 29/* Value */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 1 */ new Array( 30/* "$" */,0 ),
	/* State 2 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 30/* "$" */,-1 ),
	/* State 3 */ new Array( 30/* "$" */,-2 , 7/* "Union" */,-2 , 8/* "Intersect" */,-2 , 9/* "-" */,-2 , 10/* "X" */,-2 , 11/* "Join" */,-2 , 12/* "/" */,-2 , 17/* ")" */,-2 ),
	/* State 4 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 5 */ new Array( 18/* "[" */,15 ),
	/* State 6 */ new Array( 18/* "[" */,16 ),
	/* State 7 */ new Array( 18/* "[" */,17 ),
	/* State 8 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 9 */ new Array( 18/* "[" */,19 , 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 10 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 11 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 12 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 13 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 14 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 17/* ")" */,25 ),
	/* State 15 */ new Array( 20/* "Identifier" */,27 ),
	/* State 16 */ new Array( 20/* "Identifier" */,29 , 22/* "Integer" */,30 ),
	/* State 17 */ new Array( 16/* "(" */,33 , 20/* "Identifier" */,34 , 21/* "String" */,35 , 22/* "Integer" */,36 , 23/* "Float" */,37 ),
	/* State 18 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 30/* "$" */,-9 , 17/* ")" */,-9 ),
	/* State 19 */ new Array( 16/* "(" */,33 , 20/* "Identifier" */,34 , 21/* "String" */,35 , 22/* "Integer" */,36 , 23/* "Float" */,37 ),
	/* State 20 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 30/* "$" */,-8 , 17/* ")" */,-8 ),
	/* State 21 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 30/* "$" */,-6 , 17/* ")" */,-6 ),
	/* State 22 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 30/* "$" */,-5 , 17/* ")" */,-5 ),
	/* State 23 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 30/* "$" */,-4 , 17/* ")" */,-4 ),
	/* State 24 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 30/* "$" */,-3 , 17/* ")" */,-3 ),
	/* State 25 */ new Array( 30/* "$" */,-10 , 7/* "Union" */,-10 , 8/* "Intersect" */,-10 , 9/* "-" */,-10 , 10/* "X" */,-10 , 11/* "Join" */,-10 , 12/* "/" */,-10 , 17/* ")" */,-10 ),
	/* State 26 */ new Array( 14/* "," */,39 , 19/* "]" */,40 ),
	/* State 27 */ new Array( 19/* "]" */,-14 , 14/* "," */,-14 ),
	/* State 28 */ new Array( 14/* "," */,41 , 19/* "]" */,42 ),
	/* State 29 */ new Array( 13/* "->" */,43 ),
	/* State 30 */ new Array( 13/* "->" */,44 ),
	/* State 31 */ new Array( 2/* "||" */,45 , 3/* "&&" */,46 , 19/* "]" */,47 ),
	/* State 32 */ new Array( 15/* "Comparison" */,48 ),
	/* State 33 */ new Array( 16/* "(" */,33 , 20/* "Identifier" */,34 , 21/* "String" */,35 , 22/* "Integer" */,36 , 23/* "Float" */,37 ),
	/* State 34 */ new Array( 15/* "Comparison" */,-24 , 19/* "]" */,-24 , 3/* "&&" */,-24 , 2/* "||" */,-24 , 17/* ")" */,-24 ),
	/* State 35 */ new Array( 15/* "Comparison" */,-25 , 19/* "]" */,-25 , 3/* "&&" */,-25 , 2/* "||" */,-25 , 17/* ")" */,-25 ),
	/* State 36 */ new Array( 15/* "Comparison" */,-26 , 19/* "]" */,-26 , 3/* "&&" */,-26 , 2/* "||" */,-26 , 17/* ")" */,-26 ),
	/* State 37 */ new Array( 15/* "Comparison" */,-27 , 19/* "]" */,-27 , 3/* "&&" */,-27 , 2/* "||" */,-27 , 17/* ")" */,-27 ),
	/* State 38 */ new Array( 2/* "||" */,45 , 3/* "&&" */,46 , 19/* "]" */,50 ),
	/* State 39 */ new Array( 20/* "Identifier" */,51 ),
	/* State 40 */ new Array( 16/* "(" */,52 ),
	/* State 41 */ new Array( 20/* "Identifier" */,53 , 22/* "Integer" */,54 ),
	/* State 42 */ new Array( 16/* "(" */,55 ),
	/* State 43 */ new Array( 20/* "Identifier" */,56 ),
	/* State 44 */ new Array( 20/* "Identifier" */,57 ),
	/* State 45 */ new Array( 16/* "(" */,33 , 20/* "Identifier" */,34 , 21/* "String" */,35 , 22/* "Integer" */,36 , 23/* "Float" */,37 ),
	/* State 46 */ new Array( 16/* "(" */,33 , 20/* "Identifier" */,34 , 21/* "String" */,35 , 22/* "Integer" */,36 , 23/* "Float" */,37 ),
	/* State 47 */ new Array( 16/* "(" */,60 ),
	/* State 48 */ new Array( 20/* "Identifier" */,34 , 21/* "String" */,35 , 22/* "Integer" */,36 , 23/* "Float" */,37 ),
	/* State 49 */ new Array( 2/* "||" */,45 , 3/* "&&" */,46 , 17/* ")" */,62 ),
	/* State 50 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 51 */ new Array( 19/* "]" */,-15 , 14/* "," */,-15 ),
	/* State 52 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 53 */ new Array( 13/* "->" */,65 ),
	/* State 54 */ new Array( 13/* "->" */,66 ),
	/* State 55 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 56 */ new Array( 19/* "]" */,-16 , 14/* "," */,-16 ),
	/* State 57 */ new Array( 19/* "]" */,-17 , 14/* "," */,-17 ),
	/* State 58 */ new Array( 2/* "||" */,-22 , 3/* "&&" */,46 , 19/* "]" */,-22 , 17/* ")" */,-22 ),
	/* State 59 */ new Array( 2/* "||" */,-21 , 3/* "&&" */,-21 , 19/* "]" */,-21 , 17/* ")" */,-21 ),
	/* State 60 */ new Array( 20/* "Identifier" */,3 , 16/* "(" */,4 , 4/* "Project" */,5 , 5/* "Rename" */,6 , 6/* "Select" */,7 ),
	/* State 61 */ new Array( 19/* "]" */,-20 , 3/* "&&" */,-20 , 2/* "||" */,-20 , 17/* ")" */,-20 ),
	/* State 62 */ new Array( 19/* "]" */,-23 , 3/* "&&" */,-23 , 2/* "||" */,-23 , 17/* ")" */,-23 ),
	/* State 63 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 30/* "$" */,-7 , 17/* ")" */,-7 ),
	/* State 64 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 17/* ")" */,69 ),
	/* State 65 */ new Array( 20/* "Identifier" */,70 ),
	/* State 66 */ new Array( 20/* "Identifier" */,71 ),
	/* State 67 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 17/* ")" */,72 ),
	/* State 68 */ new Array( 12/* "/" */,8 , 11/* "Join" */,9 , 10/* "X" */,10 , 9/* "-" */,11 , 8/* "Intersect" */,12 , 7/* "Union" */,13 , 17/* ")" */,73 ),
	/* State 69 */ new Array( 30/* "$" */,-11 , 7/* "Union" */,-11 , 8/* "Intersect" */,-11 , 9/* "-" */,-11 , 10/* "X" */,-11 , 11/* "Join" */,-11 , 12/* "/" */,-11 , 17/* ")" */,-11 ),
	/* State 70 */ new Array( 19/* "]" */,-18 , 14/* "," */,-18 ),
	/* State 71 */ new Array( 19/* "]" */,-19 , 14/* "," */,-19 ),
	/* State 72 */ new Array( 30/* "$" */,-12 , 7/* "Union" */,-12 , 8/* "Intersect" */,-12 , 9/* "-" */,-12 , 10/* "X" */,-12 , 11/* "Join" */,-12 , 12/* "/" */,-12 , 17/* ")" */,-12 ),
	/* State 73 */ new Array( 30/* "$" */,-13 , 7/* "Union" */,-13 , 8/* "Intersect" */,-13 , 9/* "-" */,-13 , 10/* "X" */,-13 , 11/* "Join" */,-13 , 12/* "/" */,-13 , 17/* ")" */,-13 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 25/* Algebra */,1 , 24/* Stmt */,2 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array(  ),
	/* State 3 */ new Array(  ),
	/* State 4 */ new Array( 24/* Stmt */,14 ),
	/* State 5 */ new Array(  ),
	/* State 6 */ new Array(  ),
	/* State 7 */ new Array(  ),
	/* State 8 */ new Array( 24/* Stmt */,18 ),
	/* State 9 */ new Array( 24/* Stmt */,20 ),
	/* State 10 */ new Array( 24/* Stmt */,21 ),
	/* State 11 */ new Array( 24/* Stmt */,22 ),
	/* State 12 */ new Array( 24/* Stmt */,23 ),
	/* State 13 */ new Array( 24/* Stmt */,24 ),
	/* State 14 */ new Array(  ),
	/* State 15 */ new Array( 27/* ProjectionList */,26 ),
	/* State 16 */ new Array( 28/* RenameList */,28 ),
	/* State 17 */ new Array( 26/* Criteria */,31 , 29/* Value */,32 ),
	/* State 18 */ new Array(  ),
	/* State 19 */ new Array( 26/* Criteria */,38 , 29/* Value */,32 ),
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
	/* State 31 */ new Array(  ),
	/* State 32 */ new Array(  ),
	/* State 33 */ new Array( 26/* Criteria */,49 , 29/* Value */,32 ),
	/* State 34 */ new Array(  ),
	/* State 35 */ new Array(  ),
	/* State 36 */ new Array(  ),
	/* State 37 */ new Array(  ),
	/* State 38 */ new Array(  ),
	/* State 39 */ new Array(  ),
	/* State 40 */ new Array(  ),
	/* State 41 */ new Array(  ),
	/* State 42 */ new Array(  ),
	/* State 43 */ new Array(  ),
	/* State 44 */ new Array(  ),
	/* State 45 */ new Array( 26/* Criteria */,58 , 29/* Value */,32 ),
	/* State 46 */ new Array( 26/* Criteria */,59 , 29/* Value */,32 ),
	/* State 47 */ new Array(  ),
	/* State 48 */ new Array( 29/* Value */,61 ),
	/* State 49 */ new Array(  ),
	/* State 50 */ new Array( 24/* Stmt */,63 ),
	/* State 51 */ new Array(  ),
	/* State 52 */ new Array( 24/* Stmt */,64 ),
	/* State 53 */ new Array(  ),
	/* State 54 */ new Array(  ),
	/* State 55 */ new Array( 24/* Stmt */,67 ),
	/* State 56 */ new Array(  ),
	/* State 57 */ new Array(  ),
	/* State 58 */ new Array(  ),
	/* State 59 */ new Array(  ),
	/* State 60 */ new Array( 24/* Stmt */,68 ),
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
	/* State 71 */ new Array(  ),
	/* State 72 */ new Array(  ),
	/* State 73 */ new Array(  )
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
	"/" /* Terminal symbol */,
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
		act = 75;
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
		if( act == 75 )
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
			
			while( act == 75 && la != 30 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery\n" +
									"Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
									"Action: " + act + "\n\n" );
				if( la == -1 )
					info.offset++;
					
				while( act == 75 && sstack.length > 0 )
				{
					sstack.pop();
					vstack.pop();
					
					if( sstack.length == 0 )
						break;
						
					act = 75;
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == la )
						{
							act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
				}
				
				if( act != 75 )
					break;
				
				for( var i = 0; i < rsstack.length; i++ )
				{
					sstack.push( rsstack[i] );
					vstack.push( rvstack[i] );
				}
				
				la = __lex( info );
			}
			
			if( act == 75 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery failed, terminating parse process..." );
				break;
			}


			if( _dbg_withtrace )
				__dbg_print( "\tError recovery succeeded, continuing" );
		}
		
		/*
		if( act == 75 )
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
		 rval = new Tree.Division( vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 10:
	{
		 rval = vstack[ vstack.length - 2 ] 
	}
	break;
	case 11:
	{
		 rval = new Tree.Projection( vstack[ vstack.length - 5 ], vstack[ vstack.length - 2 ] ); 
	}
	break;
	case 12:
	{
		 rval = new Tree.Rename( vstack[ vstack.length - 5 ], vstack[ vstack.length - 2 ] ); 
	}
	break;
	case 13:
	{
		 rval = new Tree.Selection( vstack[ vstack.length - 5 ], vstack[ vstack.length - 2 ] ); 
	}
	break;
	case 14:
	{
		 rval = new Tree.ProjectionList( vstack[ vstack.length - 1 ] ); 
	}
	break;
	case 15:
	{
		 rval = vstack[ vstack.length - 3 ].add(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 16:
	{
		 rval = new Tree.RenameList( [vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]] ); 
	}
	break;
	case 17:
	{
		 rval = new Tree.RenameList( [vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]] ); 
	}
	break;
	case 18:
	{
		 rval = vstack[ vstack.length - 5 ].add( [vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]] ); 
	}
	break;
	case 19:
	{
		 rval = vstack[ vstack.length - 5 ].add( [vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]] ); 
	}
	break;
	case 20:
	{
		 rval = new Tree.Criteria(vstack[ vstack.length - 3 ], vstack[ vstack.length - 2 ], vstack[ vstack.length - 1 ]); 
	}
	break;
	case 21:
	{
		 rval = new Tree.CriteriaComposition(vstack[ vstack.length - 3 ], 'AND', vstack[ vstack.length - 1 ]); 
	}
	break;
	case 22:
	{
		 rval = new Tree.CriteriaComposition(vstack[ vstack.length - 3 ], 'OR', vstack[ vstack.length - 1 ]); 
	}
	break;
	case 23:
	{
		 rval = vstack[ vstack.length - 2 ]; 
	}
	break;
	case 24:
	{
		 rval = new Tree.Attribute( vstack[ vstack.length - 1 ] ); 
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
	case 27:
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

function RAParseError( input, errors ) {
	this.input = input;
	this.errors = errors;
}
RAParseError.prototype.input = '';
RAParseError.prototype.errors = [];
RAParseError.prototype.toString = function() {
	var error = '';
	for( var i in this.errors ) {
		error += "Parse error: Unexpected '" + this.errors[i].token + "', expecting one of '" + this.errors[i].lookahead.join("', '") + "'\n";
		if( this.errors[i].offset ) {
			error += this.input + "\n";
			error += (new Array(this.errors[i].offset+1).join('-')) + new Array(this.errors[i].token.length+1).join('^') + "\n\n";
		}
	}
	return error.substr(0, error.length-2);
}

function parser( input ) {
	algebra = null;
	
	error_count = __parse( input, error_offsets, error_lookaheads );
	if( error_count > 0 ) {
		var errors = [];
		var regexp = /^(->|\(|\)|\[|\]|&&|\|\||\/|[a-z]+|\'([^\']|\'\')*\'|[0-9]+(\.[0-9]+)?)/i
		for( var i = 0; i < error_count; i++ ) {
			var likelyToken = input.substring( error_offsets[i]).match( regexp )[0];
			errors.push({token: likelyToken, offset: error_offsets[i], lookahead: error_lookaheads[i]});
		}
		throw new RAParseError(input, errors);
  	}
  
	return algebra;
}


