#!/bin/bash
sudo mysql --user=root --password=test123 -e "source DropDB.sql"
sudo mysql --user=root --password=test123 -e "source InitSchema.sql"
sudo mysql --user=root --password=test123 pradb -e "source AutoJobGeneration.sql"
sudo mysql --user=root --password=test123 pradb -e "source PopulateDB.sql"
sudo mysql --user=root --password=test123 pradb -e "source PopulateDB_Part2.sql"
