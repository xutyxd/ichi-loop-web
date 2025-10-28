import { Component } from '@angular/core';
import { Header } from "../../../ui/components/header/header";
import { SessionList } from "../../../session/components/session-list/session-list";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-core-layout',
  imports: [RouterModule, Header, SessionList],
  templateUrl: './core-layout.html',
  styleUrl: './core-layout.scss',
})
export class CoreLayout {

}
