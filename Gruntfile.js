// example
// 第一部分 "wrapper" 函数
module.exports = function(grunt) {

    grunt.initConfig({

        // 项目和任务配置
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*\n* <%= pkg.name %>.js\n* @author <%=pkg.author %> \n* @version <%=pkg.version %> \n*/\n',
            },
            dist:{
                files: {
                    'dist/<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
                }
            }
        },
        jshint: {
            options: {},
            files: ['<%= pkg.name %>*.js']
        }
    })

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint','uglify']);
};